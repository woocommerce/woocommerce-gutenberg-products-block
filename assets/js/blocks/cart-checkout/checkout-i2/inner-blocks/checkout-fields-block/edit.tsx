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

const ALLOWED_BLOCKS = [
	'woocommerce/checkout-shipping-address-block',
	'woocommerce/checkout-contact-information-block',
];
const TEMPLATE: InnerBlockTemplate[] = [
	[ 'woocommerce/checkout-contact-information-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-address-block', {}, [] ],
];

export const Edit = (): JSX.Element => {
	// templateLock all prevents load after saving content for some reason.
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
