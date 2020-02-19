<?php
/**
 * Handle product stock reservation during checkout.
 *
 * @package WooCommerce/Blocks
 */

namespace Automattic\WooCommerce\Blocks\RestApi\StoreApi\Utilities;

defined( 'ABSPATH' ) || exit;

/**
 * Stock Reservation class.
 */
final class ReserveStock {
	/**
	 * Query for any existing holds on stock for this item.
	 *
	 * @param \WC_Product $product Product to get reserved stock for.
	 * @param integer     $exclude_order_id Optional order to exclude from the results.
	 *
	 * @return integer Amount of stock already reserved.
	 */
	public function get_reserved_stock( \WC_Product $product, $exclude_order_id = 0 ) {
		global $wpdb;

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared
		return (int) $wpdb->get_var( $this->get_query_for_reserved_stock( $product->get_stock_managed_by_id(), $exclude_order_id ) );
	}

	/**
	 * Put a temporary hold on stock for an order if enough is available.
	 *
	 * @throws ReserveStockException If stock cannot be reserved.
	 *
	 * @param \WC_Order $order Order object.
	 * @param int       $minutes How long to reserve stock in minutes. Defaults to woocommerce_hold_stock_minutes.
	 */
	public function reserve_stock_for_order( \WC_Order $order, $minutes = 0 ) {
		$minutes = $minutes ? $minutes : (int) get_option( 'woocommerce_hold_stock_minutes', 60 );

		if ( ! $minutes ) {
			return;
		}

		try {
			$items = array_filter(
				$order->get_items(),
				function( $item ) {
					return $item->is_type( 'line_item' ) && $item->get_product() instanceof \WC_Product && $item->get_quantity() > 0;
				}
			);
			$rows  = [];

			foreach ( $items as $item ) {
				$product = $item->get_product();

				if ( ! $product->is_in_stock() ) {
					throw new ReserveStockException(
						'product_out_of_stock',
						sprintf(
							/* translators: %s: product name */
							__( '%s is out of stock and cannot be purchased.', 'woo-gutenberg-products-block' ),
							$product->get_name()
						),
						403
					);
				}

				// If stock management is off, no need to reserve any stock here.
				if ( ! $product->managing_stock() || $product->backorders_allowed() ) {
					continue;
				}

				$managed_by_id          = $product->get_stock_managed_by_id();
				$rows[ $managed_by_id ] = isset( $rows[ $managed_by_id ] ) ? $rows[ $managed_by_id ] + $item->get_quantity() : $item->get_quantity();
			}

			if ( ! empty( $rows ) ) {
				foreach ( $rows as $product_id => $quantity ) {
					$this->reserve_stock_for_product( $product_id, $quantity, $order, $minutes );
				}
			}
		} catch ( ReserveStockException $e ) {
			$this->release_stock_for_order( $order );
			throw $e;
		}
	}

	/**
	 * Release a temporary hold on stock for an order.
	 *
	 * @param \WC_Order $order Order object.
	 */
	public function release_stock_for_order( \WC_Order $order ) {
		global $wpdb;

		$wpdb->delete(
			$wpdb->wc_reserved_stock,
			[
				'order_id' => $order->get_id(),
			]
		);
	}

	/**
	 * Reserve stock for a product by inserting rows into the DB.
	 *
	 * @throws ReserveStockException If a row cannot be inserted.
	 *
	 * @param int       $product_id Product ID which is having stock reserved.
	 * @param int       $stock_quantity Stock amount to reserve.
	 * @param \WC_Order $order Order object which contains the product.
	 * @param int       $minutes How long to reserve stock in minutes.
	 */
	private function reserve_stock_for_product( $product_id, $stock_quantity, \WC_Order $order, $minutes ) {
		global $wpdb;

		$query_for_stock          = $this->get_query_for_stock( $product_id );
		$query_for_reserved_stock = $this->get_query_for_reserved_stock( $product_id, $order->get_id() );

		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared
		$result = $wpdb->query(
			$wpdb->prepare(
				"
				REPLACE INTO {$wpdb->wc_reserved_stock} ( order_id, product_id, stock_quantity, expires )
				SELECT %d, %d, %d, ( NOW() + INTERVAL %d MINUTE ) from DUAL
				WHERE ( $query_for_stock FOR UPDATE ) - ( $query_for_reserved_stock FOR UPDATE ) >= %d
				",
				$order->get_id(),
				$product_id,
				$stock_quantity,
				$minutes,
				$stock_quantity
			)
		);
		// phpcs:enable WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared

		if ( ! $result ) {
			$product = wc_get_product( $product_id );
			throw new ReserveStockException(
				'product_not_enough_stock',
				sprintf(
					/* translators: %s: product name */
					__( 'Not enough units of %s are available in stock to fulfil this order.', 'woo-gutenberg-products-block' ),
					$product ? $product->get_name() : '#' . $product_id
				),
				403
			);
		}
	}

	/**
	 * Returns query statement for getting current `_stock` of a product.
	 *
	 * @todo Once merged to woo core data store, this method can be removed.
	 * @internal MAX function below is used to make sure result is a scalar.
	 * @param int $product_id Product ID.
	 * @return string|void Query statement.
	 */
	private function get_query_for_stock( $product_id ) {
		global $wpdb;
		return $wpdb->prepare(
			"
			SELECT COALESCE ( MAX( meta_value ), 0 ) FROM $wpdb->postmeta as meta_table
			WHERE meta_table.meta_key = '_stock'
			AND meta_table.post_id = %d
			",
			$product_id
		);
	}

	/**
	 * Returns query statement for getting reserved stock of a product.
	 *
	 * @param int     $product_id Product ID.
	 * @param integer $exclude_order_id Optional order to exclude from the results.
	 * @return string|void Query statement.
	 */
	private function get_query_for_reserved_stock( $product_id, $exclude_order_id = 0 ) {
		global $wpdb;
		return $wpdb->prepare(
			"
			SELECT COALESCE( SUM( stock_table.`stock_quantity` ), 0 ) FROM $wpdb->wc_reserved_stock stock_table
			LEFT JOIN $wpdb->posts posts ON stock_table.`order_id` = posts.ID
			WHERE posts.post_status IN ( 'wc-checkout-draft', 'wc-pending' )
			AND stock_table.`expires` > NOW()
			AND stock_table.`product_id` = %d
			AND stock_table.`order_id` != %d
			",
			$product_id,
			$exclude_order_id
		);
	}
}
