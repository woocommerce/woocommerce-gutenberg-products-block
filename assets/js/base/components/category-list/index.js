/**
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import CategoryListItem from './item';

const CategoryList = ( { attributes, categories = [], depth = 0 } ) => {
	return (
		<ul className="wc-block-product-categories-list">
			{ categories.length === 0 ? (
				<CategoryListItem attributes={ attributes } />
			) : (
				categories.map( ( category, i ) => (
					<CategoryListItem
						key={ category.term_id || i }
						attributes={ attributes }
						category={ category }
						depth={ depth }
					/>
				) )
			) }
		</ul>
	);
};

CategoryList.propTypes = {
	attributes: PropTypes.object.isRequired,
	categories: PropTypes.array.isRequired,
	depth: PropTypes.number,
};

export default CategoryList;
