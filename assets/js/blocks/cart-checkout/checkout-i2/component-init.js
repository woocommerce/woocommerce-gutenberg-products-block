/**
 * External dependencies
 */
import { registerBlockComponent } from '@woocommerce/blocks-registry';
import { lazy } from '@wordpress/element';
import { WC_BLOCKS_BUILD_URL } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */

// Modify webpack publicPath at runtime based on location of WordPress Plugin.
// eslint-disable-next-line no-undef,camelcase
__webpack_public_path__ = WC_BLOCKS_BUILD_URL;

registerBlockComponent( {
	blockName: 'woocommerce/checkout-fields-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/fields" */ './inner-blocks/checkout-fields-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-totals-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/totals" */ './inner-blocks/checkout-totals-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-billing-address-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/billing-address" */ './inner-blocks/checkout-billing-address-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-actions-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/actions" */ './inner-blocks/checkout-actions-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-contact-information-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/contact-information" */ './inner-blocks/checkout-contact-information-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-order-note-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/order-note" */ './inner-blocks/checkout-order-note-block/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-order-summary-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/order-summary" */ './inner-blocks/checkout-order-summary/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-payment-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/payment" */ './inner-blocks/checkout-payment-block/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/checkout-shipping-address-block',
	component: lazy( () =>
		import(
			/* webpackChunkName: "checkout-blocks/shipping-address" */ './inner-blocks/checkout-shipping-address-block/frontend'
		)
	),
} );
