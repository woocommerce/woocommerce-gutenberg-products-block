<?php
/**
 * Display the Reviews by Product block in the post content.
 * NOTE: DO NOT edit this file in WooCommerce core, this is generated from woocommerce-gutenberg-products-block.
 *
 * @package WooCommerce\Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handler for getting top-rated products for display.
 */
class WGPB_Block_Reviews_By_Product {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'reviews-by-product';

	/**
	 * Attributes.
	 *
	 * @var array
	 */
	protected $attributes = array();

	/**
	 * Initialize block.
	 *
	 * @param array $attributes Block attributes. Default empty array.
	 */
	public function __construct( $attributes = array() ) {
		$this->attributes = $this->parse_attributes( $attributes );
	}

	/**
	 * Get the block's attributes.
	 *
	 * @param array $attributes Block attributes.
	 * @return array Block attributes merged with defaults.
	 */
	protected function parse_attributes( $attributes ) {
		if ( $attributes['orderby'] ) {
			$order                 = explode( '-', $attributes['orderby'] );
			$attributes['orderby'] = $order[0];
			if ( count( $order ) > 1 ) {
				$attributes['order'] = $order[1];
			} else {
				$attributes['order'] = 'DESC';
			}
		}

		return $attributes;
	}

	/**
	 * Render the Reviews by Product.
	 *
	 * @return string Rendered block type output.
	 */
	public function render() {
		$product = wc_get_product( $this->attributes['productId'] );
		if ( ! $product ) {
			return '<h2>No product found</h2>';
		}
		$review_count = $product->get_review_count();
		if ( 0 === $review_count ) {
			return '<h2>Product with no reviews</h2>';
		}
		$comments = get_comments(
			array(
				'number'   => $this->attributes['reviewsShown'],
				'order_by' => $this->attributes['orderby'],
				'order'    => $this->attributes['order'],
				'post_id'  => $this->attributes['productId'],
				'status'   => 'approve',
				'type'     => 'review',
			)
		);
		$args     = array(
			'callback' => 'woocommerce_comments',
			'echo'     => false,
		);

		return '<div id="reviews"><ol class="commentlist">' . wp_list_comments( apply_filters( 'woocommerce_product_review_list_args', $args ), $comments ) . '</ol></div>';
	}
}
