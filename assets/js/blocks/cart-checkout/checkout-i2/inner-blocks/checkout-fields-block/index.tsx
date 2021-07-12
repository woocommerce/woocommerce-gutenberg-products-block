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

registerFeaturePluginBlockType( 'woocommerce/checkout-fields-block', {
	title: __( 'Checkout Fields Block', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'Wrapper block for checkout fields',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
		reusable: false,
		inserter: false,
	},
	parent: [ 'woocommerce/checkout-i2' ],
	attributes,
	apiVersion: 2,
	edit: Edit,
	save: Save,
	providesContext: {
		'woocommerce/showCompanyField': 'showCompanyField',
		'woocommerce/requireCompanyField': 'requireCompanyField',
		'woocommerce/showApartmentField': 'showApartmentField',
		'woocommerce/showPhoneField': 'showPhoneField',
		'woocommerce/requirePhoneField': 'requirePhoneField',
	},
} );
