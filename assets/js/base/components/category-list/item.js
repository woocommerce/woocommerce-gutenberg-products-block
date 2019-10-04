/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import CategoryList from './index';

const CategoryListItem = ( { attributes, category = {}, depth = 0 } ) => {
	const { hasCount } = attributes;
	const isLoading = ! Object.keys( category ).length > 0;
	const count = hasCount ? (
		<span className="wc-block-product-categories-list-item-count">
			{ category.count }
		</span>
	) : null;

	return (
		<li
			key={ category.term_id }
			className={ classNames( 'wc-block-product-categories-list-item', {
				'is-loading': isLoading,
			} ) }
			aria-hidden={ isLoading }
		>
			<a href={ category.permalink }>{ category.name }</a>
			{ count }

			{ !! category.children && category.children.length > 0 && (
				<CategoryList
					categories={ category.children }
					attributes={ attributes }
					depth={ depth + 1 }
				/>
			) }
		</li>
	);
};

CategoryListItem.propTypes = {
	attributes: PropTypes.object.isRequired,
	category: PropTypes.object,
	depth: PropTypes.number,
};

export default CategoryListItem;
