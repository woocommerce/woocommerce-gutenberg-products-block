/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import { Fragment } from 'react';

const renderChildren = ( { attributes, children, depth } ) => {
	return (
		<Fragment>
			{ children.map( ( category, i ) => (
				<CategorySelectOption
					key={ category.term_id || i }
					attributes={ attributes }
					category={ category }
					depth={ depth }
				/>
			) ) }
		</Fragment>
	);
};

const CategorySelectOption = ( { attributes, category = {}, depth = 0 } ) => {
	const { hasCount } = attributes;

	const count = hasCount ? `(${ category.count })` : null;

	return (
		<Fragment>
			<option key={ category.term_id } value={ category.permalink }>
				{ '–'.repeat( depth ) } { category.name } { count }
			</option>
			{ !! category.children &&
				category.children.length > 0 &&
				renderChildren( {
					attributes,
					children: category.children,
					depth: depth + 1,
				} ) }
		</Fragment>
	);
};

CategorySelectOption.propTypes = {
	attributes: PropTypes.object.isRequired,
	category: PropTypes.object,
	depth: PropTypes.number,
};

export default CategorySelectOption;
