/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { FormStep } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutContext } from '@woocommerce/base-context';
import { InnerBlocks } from '@wordpress/block-editor';

const Block = ( {} ) => {
	const { isProcessing: checkoutIsProcessing } = useCheckoutContext();

	return (
		<FormStep
			id="shipping-fields"
			disabled={ checkoutIsProcessing }
			className="wc-block-checkout__shipping-fields"
			title={ __( 'Form Step Title', 'woo-gutenberg-products-block' ) }
			description={ __(
				'Enter the physical address where you want us to deliver your order.',
				'woo-gutenberg-products-block'
			) }
		>
			<BlockContent isEditor={ true } />
		</FormStep>
	);
};

const BlockContent = ( { isEditor } ) => {
	const content = isEditor ? (
		<InnerBlocks allowedBlocks={ {} } template={ [] } templateLock={ '' } />
	) : (
		<InnerBlocks.Content />
	);
	return content;
};

export default Block;
