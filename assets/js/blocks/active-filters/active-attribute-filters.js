/**
 * External dependencies
 */
import { useCollection, useQueryStateByKey } from '@woocommerce/base-hooks';

/**
 * Internal dependencies
 */
import { renderRemovableListItem } from './utils';
import { removeAttributeFilterBySlug } from '../../utils/attributes-query';

/**
 * Component that renders active attribute (terms) filters.
 */
const ActiveAttributeFilters = ( { attributeObject = {}, slugs = [] } ) => {
	const { results, isLoading } = useCollection( {
		namespace: '/wc/store',
		resourceName: 'products/attributes/terms',
		resourceValues: [ attributeObject.id ],
	} );

	const [ productAttributes, setProductAttributes ] = useQueryStateByKey(
		'product-grid',
		'attributes',
		[]
	);

	if ( isLoading ) {
		return null;
	}

	const attributeLabel = attributeObject.label;

	return slugs.map( ( slug ) => {
		const termObject =
			results.find( ( term ) => {
				return term.slug === slug;
			} ) || null;

		return renderRemovableListItem(
			attributeLabel,
			termObject.name || slug,
			() => {
				removeAttributeFilterBySlug(
					productAttributes,
					setProductAttributes,
					attributeObject,
					slug
				);
			}
		);
	} );
};

export default ActiveAttributeFilters;
