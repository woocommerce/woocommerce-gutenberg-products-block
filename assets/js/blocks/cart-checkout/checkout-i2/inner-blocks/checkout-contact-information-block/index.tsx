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

registerFeaturePluginBlockType(
	'woocommerce/checkout-contact-information-block',
	{
		title: __( 'Contact Information', 'woo-gutenberg-products-block' ),
		category: 'woocommerce',
		description: __(
			'Checkout contact information step.',
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
					'Contact information',
					'woo-gutenberg-products-block'
				),
				defaultDescription: __(
					"We'll use this email to send you details and updates about your order.",
					'woo-gutenberg-products-block'
				),
			} ),
			allowCreateAccount: {
				type: 'boolean',
				default: false,
			},
		},
		apiVersion: 2,
		edit: Edit,
		save: Save,
	}
);
