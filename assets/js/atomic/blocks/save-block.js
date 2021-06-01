/**
 * External dependencies
 */
import classnames from 'classnames';

export const save = ( { attributes } ) => {
	return (
		<div className={ classnames( 'is-loading', attributes.className ) } />
	);
};

export default save;
