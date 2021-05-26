/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';

registerFeaturePluginBlockType( 'woocommerce/checkout-actions-block', {
	title: __( 'Actions', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Checkout actions buttons block.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	attributes: {
		cartPageId: {
			type: 'number',
			default: 0,
		},
		showReturnToCart: {
			type: 'boolean',
			default: true,
		},
	},
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
