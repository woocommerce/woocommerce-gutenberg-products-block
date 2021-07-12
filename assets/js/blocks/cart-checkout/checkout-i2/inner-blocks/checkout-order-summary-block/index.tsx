/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';

registerFeaturePluginBlockType( 'woocommerce/checkout-order-summary-block', {
	title: __( 'Order Summary', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Displays the order summary and totals.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
		reusable: false,
		inserter: false,
		lock: {
			remove: true,
			move: true,
		},
	},
	parent: [ 'woocommerce/checkout-totals-block' ],
	attributes: {
		showCompanyField: {
			type: 'boolean',
			default: false,
		},
		requireCompanyField: {
			type: 'boolean',
			default: false,
		},
		allowCreateAccount: {
			type: 'boolean',
			default: false,
		},
		showApartmentField: {
			type: 'boolean',
			default: true,
		},
	},
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
