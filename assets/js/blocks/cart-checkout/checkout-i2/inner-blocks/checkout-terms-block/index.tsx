/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';
/**
 * Internal dependencies
 */
import { termsConsentDefaultText, termsCheckboxDefaultText } from './constants';
import { Edit, Save } from './edit';

registerFeaturePluginBlockType( 'woocommerce/checkout-terms-block', {
	title: __( 'Terms and Conditions', 'woo-gutenberg-products-block' ),
	category: 'woocommerce',
	description: __(
		'A checkbox for people to agree to the terms and conditions',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: false,
		html: false,
		multiple: false,
	},
	parent: [ 'woocommerce/checkout-fields-block' ],
	attributes: {
		checkbox: {
			type: 'boolean',
			default: false,
		},
		text: {
			type: 'string',
			required: true,
		},
	},
	variations: [
		{
			name: 'terms-consent',
			title: 'Terms Consent',
			isDefault: true,
			attributes: {
				checkbox: false,
				text: termsConsentDefaultText,
			},
			scope: [ 'inserter', 'block', 'transform' ],
			isActive: ( blockAttributes: Record< string, unknown > ) =>
				blockAttributes.checkbox === false,
		},
		{
			name: 'terms-checkbox',
			title: 'Terms Checkbox',
			attributes: {
				checkbox: true,
				text: termsCheckboxDefaultText,
			},
			scope: [ 'inserter', 'block', 'transform' ],
			isActive: ( blockAttributes: Record< string, unknown > ) =>
				blockAttributes.checkbox === true,
		},
	],
	edit: Edit,
	save: Save,
} );
