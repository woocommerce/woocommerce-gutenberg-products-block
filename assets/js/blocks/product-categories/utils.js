/**
 * External dependencies
 */
import { getSetting } from '@woocommerce/settings';

/**
 * Get categories from JSON settings.
 *
 * @param {string} fallback  Default value if setting is missing.
 * @return {Array} Array of terms.
 */
export const getCategories = ( fallback = [] ) => {
	return getSetting( 'productCategories', fallback );
};

/**
 * Format categories based on settings.
 *
 * @param {Array} categories  Array of terms.
 * @param {Object} Attributes.
 * @return {Array} Array of terms.
 */
export const formatCategories = ( categories = [], { hasEmpty, isHierarchical } ) => {
	if ( ! hasEmpty ) {
		categories = removeEmptyCategories( categories );
	}

	if ( isHierarchical ) {
		categories = buildCategoryTree( categories );
	}

	return categories;
};

/**
 * Remove categories with 0 count.
 *
 * @param {Array} categories  Array of terms.
 */
export const removeEmptyCategories = ( categories = [] ) => {
	return categories.filter(
		( cat ) => !! cat.count
	);
};

/**
 * Returns terms in a tree form.
 *
 * @param {Array} categories  Array of terms in flat format.
 * @return {Array} Array of terms in tree format.
 */
export const buildCategoryTree = ( categories = [] ) => {
	// Group terms by the parent ID.
	const termsByParent = [];

	categories.map( ( v ) => {
		const parentKey = v.parent.toString();
		termsByParent[ parentKey ] = termsByParent[ parentKey ] || [];
		termsByParent[ parentKey ].push( v );
		return v;
	} );

	const fillWithChildren = ( terms ) => {
		return terms.map( ( term ) => {
			const parentKey = term.term_id.toString();
			const children = termsByParent[ parentKey ];
			return {
				...term,
				children:
					children && children.length
						? fillWithChildren( children )
						: [],
			};
		} );
	};

	return fillWithChildren( termsByParent[ '0' ] || [] );
}
