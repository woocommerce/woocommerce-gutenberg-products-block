/**
 * External dependencies
 */
import { getSetting } from '@woocommerce/settings';

/**
 * Internal dependencies
 */
import { buildTermsTree } from './hierarchy';

/**
 * Returns categories in tree form.
 */
export default function( { hasEmpty, isHierarchical } ) {
	const PRODUCT_CATEGORIES = getSetting( 'productCategories', [] );
	const categories = PRODUCT_CATEGORIES.filter(
		( cat ) => hasEmpty || !! cat.count
	);
	return isHierarchical ? buildTermsTree( categories ) : categories;
}
