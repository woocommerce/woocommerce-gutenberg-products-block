/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';

registerFeaturePluginBlockType( 'woocommerce/checkout-newsletter-block', {
	title: __( 'Newsletter Subscription', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'A field to Subscribe to a newsletters',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	parent: [ 'woocommerce/checkout-fields-block' ],
	attributes: {
		optOut: {
			type: 'boolean',
			default: false,
		},
		description: {
			type: 'string',
			default: 'Subscribe to our newsletter',
		},
	},
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
