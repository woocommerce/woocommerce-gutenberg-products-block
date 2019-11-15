/**
 * External dependencies
 */
import { sortBy, map } from 'lodash';

/**
 * Given a query object, removes an attribute filter by a single slug.
 * @param {Object} query Current query object.
 * @param {Function} setQuery Callback to update the current query object.
 * @param {Object} attribute An attribute object.
 * @param {string} slug Term slug to remove.
 */
export const removeAttributeFilterBySlug = (
	query = {},
	setQuery = () => {},
	attribute,
	slug = ''
) => {
	// Get current filter for provided attribute.
	const currentQuery = query.filter(
		( item ) => item.attribute === attribute.taxonomy
	)[ 0 ];

	if (
		! currentQuery ||
		! currentQuery.slug ||
		! currentQuery.slug.includes( slug )
	) {
		return;
	}

	const newSlugs = currentQuery.slug.filter( ( item ) => item !== slug );

	// Remove current attribute filter from query.
	const returnQuery = query.filter(
		( item ) => item.attribute !== attribute.taxonomy
	);

	// Add a new query for selected terms, if provided.
	if ( newSlugs.length > 0 ) {
		currentQuery.slug = newSlugs.sort();
		returnQuery.push( currentQuery );
	}

	setQuery( sortBy( returnQuery, 'attribute' ) );
};

/**
 * Given a query object, sets the query up to filter by a given attribute and attribute terms.
 * @param {Object} query Current query object.
 * @param {Function} setQuery Callback to update the current query object.
 * @param {Object} attribute An attribute object.
 * @param {Array} attributeTerms Array of term objects.
 * @param {string} operator Operator for the filter. Valid values: in, and.
 */
export const updateAttributeFilter = (
	query = {},
	setQuery = () => {},
	attribute,
	attributeTerms = [],
	operator = 'in'
) => {
	// Remove current attribute filter from query.
	const returnQuery = query.filter(
		( item ) => item.attribute !== attribute.taxonomy
	);

	// Add a new query for selected terms, if provided.
	if ( attributeTerms.length > 0 ) {
		const filterQuery = {
			attribute: attribute.taxonomy,
			operator,
			slug: map( attributeTerms, 'slug' ).sort(),
		};
		returnQuery.push( filterQuery );
	}

	setQuery( sortBy( returnQuery, 'attribute' ) );
};
