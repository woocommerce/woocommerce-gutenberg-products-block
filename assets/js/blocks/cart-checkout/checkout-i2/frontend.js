/**
 * External dependencies
 */
import { getValidBlockAttributes } from '@woocommerce/base-utils';
import { renderParentBlock } from '@woocommerce/atomic-utils';
/**
 * Internal dependencies
 */
import Block from './block';
import blockAttributes from './attributes';
import { renderStandaloneBlocks } from './render-standalone-blocks';

const getProps = ( el ) => {
	return {
		attributes: getValidBlockAttributes( blockAttributes, el.dataset ),
	};
};

renderParentBlock( {
	Block,
	blockName: 'woocommerce/checkout-i2',
	selector: '.wp-block-woocommerce-checkout-i2',
	getProps,
} );

renderStandaloneBlocks();
