/**
 * External dependencies
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import type { InnerBlockTemplate } from '../types';

export const Column = ( {
	allowedBlocks = [],
	template = [],
	templateLock = 'all',
	children,
}: {
	allowedBlocks?: string[];
	template?: InnerBlockTemplate[];
	templateLock?: 'all' | 'insert' | false;
	isEditor: boolean;
	children?: React.ReactNode;
} ): JSX.Element => {
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			{ children }
			<InnerBlocks
				allowedBlocks={ allowedBlocks }
				template={ template }
				templateLock={ templateLock }
			/>
		</div>
	);
};
