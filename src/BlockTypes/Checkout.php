<?php
/**
 * Checkout block.
 *
 * @package WooCommerce/Blocks
 */

namespace Automattic\WooCommerce\Blocks\BlockTypes;

use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Assets;
use Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry;

defined( 'ABSPATH' ) || exit;

/**
 * Checkout class.
 */
class Checkout extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'checkout';

	/**
	 * Registers the block type with WordPress.
	 */
	public function register_block_type() {
		register_block_type(
			$this->namespace . '/' . $this->block_name,
			array(
				'render_callback' => array( $this, 'render' ),
				'editor_script'   => 'wc-' . $this->block_name . '-block',
				'editor_style'    => 'wc-block-editor',
				'style'           => 'wc-block-style',
				'script'          => 'wc-' . $this->block_name . '-block-frontend',
			)
		);
	}

	/**
	 * Append frontend scripts when rendering the block.
	 *
	 * @param array  $attributes Block attributes. Default empty array.
	 * @param string $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	public function render( $attributes = array(), $content = '' ) {
		$data_registry = Package::container()->get(
			AssetDataRegistry::class
		);

		$block_data = [
			'allowedCountries'  => [ WC()->countries, 'get_allowed_countries' ],
			'shippingCountries' => [ WC()->countries, 'get_shipping_countries' ],
			'allowedStates'     => [ WC()->countries, 'get_allowed_country_states' ],
			'shippingStates'    => [ WC()->countries, 'get_shipping_country_states' ],
		];

		foreach ( $block_data as $key => $callback ) {
			if ( ! $data_registry->exists( $key ) ) {
				$data_registry->add( $key, call_user_func( $callback ) );
			}
		}

		$permalink = ! empty( $attributes['cartPageId'] ) ? get_permalink( $attributes['cartPageId'] ) : false;

		if ( $permalink && ! $data_registry->exists( 'page-' . $attributes['cartPageId'] ) ) {
			$data_registry->add( 'page-' . $attributes['cartPageId'], $permalink );
		}

		// Hydrate the following data depending on admin or frontend context.
		if ( is_admin() ) {
			$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : false;

			if ( $screen && $screen->is_block_editor() && ! $data_registry->exists( 'shippingMethodsExist' ) ) {
				$methods_exist = wc_get_shipping_method_count() > 0;
				$data_registry->add( 'shippingMethodsExist', $methods_exist );
			}
		} else {
			$this->hydrate_from_api( $data_registry );
			$this->hydrate_customer_payment_methods( $data_registry );
		}

		do_action( 'woocommerce_blocks_enqueue_checkout_block_scripts_before' );
		Assets::register_block_script( $this->block_name . '-frontend', $this->block_name . '-block-frontend' );
		do_action( 'woocommerce_blocks_enqueue_checkout_block_scripts_after' );

		$skeleton = $this->get_skeleton();
		$checkout = WC()->checkout();
		do_action( 'woocommerce_after_checkout_form', $checkout );

		return $content . $skeleton;
	}

	/**
	 * Get customer payment methods for use in checkout.
	 *
	 * @param AssetDataRegistry $data_registry Data registry instance.
	 */
	protected function hydrate_customer_payment_methods( AssetDataRegistry $data_registry ) {
		if ( ! is_user_logged_in() || $data_registry->exists( 'customerPaymentMethods' ) ) {
			return;
		}
		add_filter( 'woocommerce_payment_methods_list_item', [ $this, 'include_token_id_with_payment_methods' ], 10, 2 );
		$data_registry->add(
			'customerPaymentMethods',
			wc_get_customer_saved_methods_list( get_current_user_id() )
		);
		remove_filter( 'woocommerce_payment_methods_list_item', [ $this, 'include_token_id_with_payment_methods' ], 10, 2 );
	}

	/**
	 * Hydrate the checkout block with data from the API.
	 *
	 * @param AssetDataRegistry $data_registry Data registry instance.
	 */
	protected function hydrate_from_api( AssetDataRegistry $data_registry ) {
		if ( ! $data_registry->exists( 'cartData' ) ) {
			$data_registry->add( 'cartData', WC()->api->get_endpoint_data( '/wc/store/cart' ) );
		}
		if ( ! $data_registry->exists( 'checkoutData' ) ) {
			$data_registry->add( 'checkoutData', WC()->api->get_endpoint_data( '/wc/store/checkout' ) );
		}
	}

	/**
	 * Render skeleton markup for the checkout block.
	 */
	protected function get_skeleton() {
		return '
			<div class="wc-block-sidebar-layout wc-block-checkout wc-block-checkout--is-loading wc-block-checkout--skeleton" aria-hidden="true">
				<div class="wc-block-main">
					<div class="wc-block-component-express-checkout"></div>
					<div class="wc-block-component-express-checkout-continue-rule"><span></span></div>
					<form class="wc-block-checkout-form">
						<fieldset class="wc-block-checkout__contact-fields wc-block-checkout-step">
							<span></span>
						</fieldset>
						<fieldset class="wc-block-checkout__contact-fields wc-block-checkout-step">
							<span></span>
						</fieldset>
						<fieldset class="wc-block-checkout__contact-fields wc-block-checkout-step">
							<span></span>
						</fieldset>
						<fieldset class="wc-block-checkout__contact-fields wc-block-checkout-step">
							<span></span>
						</fieldset>
						<div class="wc-block-checkout__actions">
							<button class="components-button button wc-block-button wc-block-components-checkout-place-order-button">&nbsp;</button>
						</div>
					</form>
				</div>
				<div class="wc-block-sidebar wc-block-checkout__sidebar">
					<div class="components-card"></div>
				</div>
			</div>
		';
	}

	/**
	 * Callback for woocommerce_payment_methods_list_item filter to add token id
	 * to the generated list.
	 *
	 * @param array     $list_item The current list item for the saved payment method.
	 * @param \WC_Token $token     The token for the current list item.
	 *
	 * @return array The list item with the token id added.
	 */
	public static function include_token_id_with_payment_methods( $list_item, $token ) {
		$list_item['tokenId'] = $token->get_id();
		$brand                = ! empty( $list_item['method']['brand'] ) ?
			strtolower( $list_item['method']['brand'] ) :
			'';
		// phpcs:ignore WordPress.WP.I18n.TextDomainMismatch -- need to match on translated value from core.
		if ( ! empty( $brand ) && esc_html__( 'Credit card', 'woocommerce' ) !== $brand ) {
			$list_item['method']['brand'] = wc_get_credit_card_type_label( $brand );
		}
		return $list_item;
	}
}
