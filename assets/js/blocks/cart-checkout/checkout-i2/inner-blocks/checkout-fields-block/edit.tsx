/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { Column } from '../../columns';
import type { InnerBlockTemplate } from '../../types';

const ALLOWED_BLOCKS = [ 'woocommerce/checkout-form-step' ];
const TEMPLATE: InnerBlockTemplate[] = [
	[
		'woocommerce/checkout-form-step',
		{
			title: __( 'Contact information', 'woo-gutenberg-products-block' ),
			description: __(
				"We'll use these details to send you updates about your order.",
				'woo-gutenberg-products-block'
			),
		},
		[ [ 'woocommerce/checkout-contact-information', {}, [] ] ],
	],
	[
		'woocommerce/checkout-form-step',
		{
			title: __( 'Shipping address', 'woo-gutenberg-products-block' ),
			description: __(
				'Enter the address where you want your order delivered.',
				'woo-gutenberg-products-block'
			),
		},
		[ [ 'woocommerce/checkout-shipping-address', {}, [] ] ],
	],
	[
		'woocommerce/checkout-form-step',
		{
			title: __( 'Billing address', 'woo-gutenberg-products-block' ),
			description: __(
				'Enter the address that matches your card or payment method.',
				'woo-gutenberg-products-block'
			),
		},
		[],
	],
];

export const Edit = (): JSX.Element => {
	return (
		<Column
			allowedBlocks={ ALLOWED_BLOCKS }
			template={ TEMPLATE }
			templateLock="insert"
		>
			<h2>{ __( 'Checkout Fields', 'woo-gutenberg-products-block' ) }</h2>
		</Column>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
};
