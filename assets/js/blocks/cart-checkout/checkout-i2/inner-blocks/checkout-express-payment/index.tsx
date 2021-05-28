/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';

registerFeaturePluginBlockType( 'woocommerce/checkout-express-payment-block', {
	title: __( 'Express Checkout', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Checkout express payment methods block',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	attributes: {},
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
