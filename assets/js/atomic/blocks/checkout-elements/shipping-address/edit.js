/**
 * External dependencies
 */
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Block from './block';

const Edit = ( { attributes } ) => {
	return (
		<Disabled>
			<Block { ...attributes } />
		</Disabled>
	);
};

export default Edit;
