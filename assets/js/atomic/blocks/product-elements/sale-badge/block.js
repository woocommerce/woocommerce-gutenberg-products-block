/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import Label from '@woocommerce/base-components/label';
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
 * Product Sale Badge Block Component.
 *
 * @param {Object} props             Incoming props.
 * @param {string} [props.className] CSS Class name for the component.
 * @param {string} [props.align]     Alignment of the badge.
 * @return {*} The component.
 */
const Block = ( { className, align } ) => {
	const { parentClassName } = useInnerBlockLayoutContext();
	const { product } = useProductDataContext();

	if ( ! product || ! product.on_sale ) {
		return null;
	}

	const alignClass =
		typeof align === 'string'
			? `wc-block-components-product-sale-badge--align${ align }`
			: '';

	return (
		<div
			className={ classnames(
				'wc-block-components-product-sale-badge',
				className,
				alignClass,
				`${ parentClassName }__product-onsale`
			) }
		>
			<Label
				label={ __( 'Sale', 'woo-gutenberg-products-block' ) }
				screenReaderLabel={ __(
					'Product on sale',
					'woo-gutenberg-products-block'
				) }
			/>
		</div>
	);
};

Block.propTypes = {
	className: PropTypes.string,
	align: PropTypes.string,
};

export default withProductDataContext( Block );
