/**
 * External dependencies
 */
import classnames from 'classnames';
import { InnerBlocks } from '@wordpress/block-editor';

export const save = ( { attributes } ) => {
	return (
		<div className={ classnames( 'is-loading', attributes.className ) } />
	);
};

export const saveInnerblocks = ( { attributes } ) => {
	return (
		<div className={ classnames( 'is-loading', attributes.className ) }>
			<InnerBlocks.Content />
		</div>
	);
};

export default save;
