/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { decodeEntities } from '@wordpress/html-entities';
import classnames from 'classnames';
import { createInterpolateElement } from 'wordpress-element';

/**
 * Internal dependencies
 */
import './style.scss';

const ProductName = ( {
	className = '',
	disabled = false,
	name,
	permalink = '',
	format = '<name/>',
	...props
} ) => {

	const classes = classnames( 'wc-block-components-product-name', className );

	if ( ! format.includes( '<name/>' ) ) {
		format = '<name/>';
		// eslint-disable-next-line no-console
		console.error( 'Product name formats need to include the `<name/>` tag.' );
	}

	const productNameComponent = disabled ? (
		<span className={ classes } { ...props }>
			{ decodeEntities( name ) }
		</span>
	) : (
		<a className={ classes } href={ permalink } { ...props }>
			{ decodeEntities( name ) }
		</a>
	);

	return createInterpolateElement( format, {
		name: productNameComponent
	} );
};

ProductName.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	name: PropTypes.string.isRequired,
	permalink: PropTypes.string,
};

export default ProductName;
