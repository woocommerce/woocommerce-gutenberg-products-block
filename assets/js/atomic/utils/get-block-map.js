/**
 * External dependencies
 */
import { getRegisteredInnerBlocks } from '@woocommerce/blocks-registry';

/**
 * Internal dependencies
 */
import {
	ProductTitle,
	ProductPrice,
	ProductButton,
	ProductImage,
	ProductRating,
	ProductSummary,
	ProductSaleBadge,
} from '../blocks/product/block-components';

/**
 * Map blocks names to components.
 *
 * @param {string} blockName Name of the parent block. Used to get extension children.
 */
export const getBlockMap = ( blockName ) => ( {
	'woocommerce/product-price': ProductPrice,
	'woocommerce/product-image': ProductImage,
	'woocommerce/product-title': ProductTitle,
	'woocommerce/product-rating': ProductRating,
	'woocommerce/product-button': ProductButton,
	'woocommerce/product-summary': ProductSummary,
	'woocommerce/product-sale-badge': ProductSaleBadge,
	...getRegisteredInnerBlocks( blockName ),
} );
