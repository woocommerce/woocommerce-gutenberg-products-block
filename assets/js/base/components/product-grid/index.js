/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Pagination from '../pagination';
import ProductOrderSelect from '../product-order-select';
import ProductGridItem from '../product-grid-item';
import withProducts from '../../hocs/with-products';
import withScrollToTop from '../../hocs/with-scroll-to-top';
import './style.scss';

const ProductGrid = ( {
	attributes,
	currentPage,
	onOrderChange,
	onPageChange,
	orderValue,
	products,
	scrollToTop,
	totalProducts,
} ) => {
	const onPaginationChange = ( newPage ) => {
		scrollToTop( { focusableSelector: 'a, button' } );
		onPageChange( newPage );
	};

	const getClassnames = () => {
		const { columns, rows, className, alignButtons, align } = attributes;
		const alignClass = typeof align !== 'undefined' ? 'align' + align : '';

		return classnames(
			'wc-block-grid',
			className,
			alignClass,
			'has-' + columns + '-columns',
			{
				'has-multiple-rows': rows > 1,
				'has-aligned-buttons': alignButtons,
			}
		);
	};

	const perPage = attributes.columns * attributes.rows;
	const totalPages = Math.ceil( totalProducts / perPage );
	const gridProducts = products.length
		? products
		: Array.from( { length: perPage } );

	return (
		<div className={ getClassnames() }>
			{ attributes.showOrderby && (
				<ProductOrderSelect
					onChange={ onOrderChange }
					value={ orderValue }
				/>
			) }
			<ul className="wc-block-grid__products">
				{ gridProducts.map( ( product = {}, i ) => (
					<ProductGridItem
						key={ product.id || i }
						attributes={ attributes }
						product={ product }
					/>
				) ) }
			</ul>
			{ totalProducts > perPage && (
				<Pagination
					currentPage={ currentPage }
					onPageChange={ onPaginationChange }
					totalPages={ totalPages }
				/>
			) }
		</div>
	);
};

ProductGrid.propTypes = {
	attributes: PropTypes.object.isRequired,
	// From withScrollToTop.
	scrollToTop: PropTypes.func,
	// From withProducts.
	products: PropTypes.array,
};

export default withScrollToTop( withProducts( ProductGrid ) );
