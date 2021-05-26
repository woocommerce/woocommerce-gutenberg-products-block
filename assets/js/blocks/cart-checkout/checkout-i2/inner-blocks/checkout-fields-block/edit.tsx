/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Main } from '@woocommerce/base-components/sidebar-layout';

/**
 * Internal dependencies
 */
import type { InnerBlockTemplate } from '../../types';

const ALLOWED_BLOCKS = [
	'woocommerce/checkout-shipping-address-block',
	'woocommerce/checkout-contact-information-block',
	'woocommerce/checkout-billing-address-block',
	'woocommerce/checkout-order-note-block',
	'woocommerce/checkout-actions-block',
];
const TEMPLATE: InnerBlockTemplate[] = [
	[ 'woocommerce/checkout-contact-information-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-address-block', {}, [] ],
	[ 'woocommerce/checkout-billing-address-block', {}, [] ],
	[ 'woocommerce/checkout-order-note-block', {}, [] ],
	[ 'woocommerce/checkout-actions-block', {}, [] ],
];

// @todo templateLock all prevents load after saving content for some reason.
export const Edit = (): JSX.Element => {
	const blockProps = useBlockProps();

	return (
		<Main>
			<div { ...blockProps }>
				<h2>
					{ __( 'Checkout Fields', 'woo-gutenberg-products-block' ) }
				</h2>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					templateLock={ 'insert' }
				/>
			</div>
		</Main>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
};
