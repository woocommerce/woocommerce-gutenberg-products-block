/**
 * Internal dependencies
 */
import FrontendBlock from './frontend-block.js';
import { getCategories } from './utils';
import renderFrontend from '../../utils/render-frontend.js';

const getProps = ( el ) => {
	const attributes = {
		hasCount: el.dataset.hasCount === 'true',
		hasEmpty: el.dataset.hasEmpty === 'true',
		isDropdown: el.dataset.isDropdown === 'true',
		isHierarchical: el.dataset.isHierarchical === 'true',
	};

	return {
		attributes,
		categories: getCategories(),
	};
};

renderFrontend( '.wp-block-woocommerce-product-categories', FrontendBlock, getProps );
