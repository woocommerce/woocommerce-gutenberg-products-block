/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { Sidebar } from '@woocommerce/base-components/sidebar-layout';

/**
 * Internal dependencies
 */
import type { InnerBlockTemplate } from '../../types';

const ALLOWED_BLOCKS: string[] = [];
const TEMPLATE: InnerBlockTemplate[] = [];

export const Edit = (): JSX.Element => {
	const blockProps = useBlockProps();

	return (
		<Sidebar>
			<div { ...blockProps }>
				<h2>
					{ __( 'Checkout Totals', 'woo-gutenberg-products-block' ) }
				</h2>
				<InnerBlocks
					allowedBlocks={ ALLOWED_BLOCKS }
					template={ TEMPLATE }
					templateLock={ 'insert' }
				/>
			</div>
		</Sidebar>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
};
