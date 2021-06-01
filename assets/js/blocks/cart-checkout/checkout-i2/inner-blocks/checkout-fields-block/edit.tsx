/**
 * External dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Main } from '@woocommerce/base-components/sidebar-layout';
import { getRegisteredBlocks } from '@woocommerce/blocks-checkout';
/**
 * Internal dependencies
 */
import type { InnerBlockTemplate } from '../../types';

const ALLOWED_BLOCKS = [
	'woocommerce/checkout-express-payment-block',
	'woocommerce/checkout-shipping-address-block',
	'woocommerce/checkout-shipping-methods',
	'woocommerce/checkout-contact-information-block',
	'woocommerce/checkout-billing-address-block',
	'woocommerce/checkout-payment-block',
	'woocommerce/checkout-order-note-block',
	'woocommerce/checkout-actions-block',
	...getRegisteredBlocks( 'fields' ),
];
const TEMPLATE: InnerBlockTemplate[] = [
	[ 'woocommerce/checkout-express-payment-block', {}, [] ],
	[ 'woocommerce/checkout-contact-information-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-address-block', {}, [] ],
	[ 'woocommerce/checkout-billing-address-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-methods', {}, [] ],
	[ 'woocommerce/checkout-payment-block', {}, [] ],
	[ 'woocommerce/checkout-order-note-block', {}, [] ],
	[ 'woocommerce/checkout-actions-block', {}, [] ],
];

// @todo templateLock all prevents load after saving content for some reason.
export const Edit = (): JSX.Element => {
	const blockProps = useBlockProps();

	return (
		<Main className="wc-block-checkout__main">
			<div { ...blockProps }>
				<form className="wc-block-components-form wc-block-checkout__form">
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						templateLock={ 'insert' }
					/>
				</form>
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
