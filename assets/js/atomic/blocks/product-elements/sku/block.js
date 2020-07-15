/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
	useInnerBlockLayoutContext,
	useProductDataContext,
} from '@woocommerce/shared-context';

/**
 * Internal dependencies
 */
import './style.scss';
import withProductDataContext from '../shared/with-product-data-context';

/**
 * Product SKU Block Component.
 *
 * @param {Object} props             Incoming props.
 * @param {string} [props.className] CSS Class name for the component.
 * @return {*} The component.
 */
const Block = ( { className } ) => {
	const { parentClassName } = useInnerBlockLayoutContext();
	const { product } = useProductDataContext();
	const sku = product && product.sku ? product.sku : '';

	if ( ! sku ) {
		return null;
	}

	return (
		<div
			className={ classnames(
				className,
				'wc-block-components-product-sku',
				`${ parentClassName }__product-sku`
			) }
		>
			{ __( 'SKU:', 'woo-gutenberg-products-block' ) }{ ' ' }
			<strong>{ sku }</strong>
		</div>
	);
};

Block.propTypes = {
	className: PropTypes.string,
};

export default withProductDataContext( Block );
