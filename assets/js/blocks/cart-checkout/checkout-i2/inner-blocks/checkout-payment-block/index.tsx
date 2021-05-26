/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';
import attributes from './attributes';

registerFeaturePluginBlockType( 'woocommerce/checkout-payment-block', {
	title: __( 'Payment Method', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Checkout payment methods block.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	attributes,
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
