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

const ALLOWED_BLOCKS: string[] = [];
const TEMPLATE: InnerBlockTemplate[] = [];

export const Edit = (): JSX.Element => {
	return (
		<Column
			allowedBlocks={ ALLOWED_BLOCKS }
			template={ TEMPLATE }
			templateLock="insert"
		>
			<h2>{ __( 'Checkout Totals', 'woo-gutenberg-products-block' ) }</h2>
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
