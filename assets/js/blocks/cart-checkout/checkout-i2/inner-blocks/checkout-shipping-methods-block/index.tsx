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

registerFeaturePluginBlockType( 'woocommerce/checkout-shipping-methods-block', {
	title: __( 'Shipping Methods', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Checkout Shipping Methods Block',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	parent: [ 'woocommerce/checkout-fields-block' ],
	attributes,
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
