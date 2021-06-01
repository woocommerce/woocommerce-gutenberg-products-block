/**
 * External dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { SidebarLayout } from '@woocommerce/base-components/sidebar-layout';
import { CheckoutProvider, EditorProvider } from '@woocommerce/base-context';
import {
	previewCart,
	previewSavedPaymentMethods,
} from '@woocommerce/resource-previews';
/**
 * Internal dependencies
 */
import { Columns } from './columns';

// Array of allowed block names.
const ALLOWED_BLOCKS: string[] = [
	'woocommerce/checkout-fields-block',
	'woocommerce/checkout-totals-block',
];

// Default block template.
const TEMPLATE = [
	[ 'woocommerce/checkout-fields-block', {}, [] ],
	[ 'woocommerce/checkout-totals-block', {}, [] ],
];

// @todo templateLock all prevents load after saving content for some reason.
export const Edit = (): JSX.Element => {
	return (
		<EditorProvider
			previewData={ { previewCart, previewSavedPaymentMethods } }
		>
			<CheckoutProvider>
				<Columns>
					<SidebarLayout className={ 'wc-block-checkout' }>
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							templateLock="insert"
						/>
					</SidebarLayout>
				</Columns>
			</CheckoutProvider>
		</EditorProvider>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'wc-block-checkout is-loading',
			} ) }
		>
			<InnerBlocks.Content />
		</div>
	);
};
