/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';
import formStepAttributes from '../../form-step/attributes';

registerFeaturePluginBlockType( 'woocommerce/checkout-shipping-address-block', {
	title: __( 'Shipping Address', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Checkout shipping address step.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	attributes: {
		...formStepAttributes( {
			defaultTitle: __(
				'Shipping address',
				'woo-gutenberg-products-block'
			),
			defaultDescription: __(
				'Enter the address where you want your order delivered.',
				'woo-gutenberg-products-block'
			),
		} ),
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
		showPhoneField: {
			type: 'boolean',
			default: true,
		},
		requirePhoneField: {
			type: 'boolean',
			default: false,
		},
	},
	apiVersion: 2,
	edit: Edit,
	save: Save,
} );
