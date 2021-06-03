/**
 * External dependencies
 */
import { getValidBlockAttributes } from '@woocommerce/base-utils';
import {
	withStoreCartApiHydration,
	withRestApiHydration,
} from '@woocommerce/block-hocs';

/**
 * Internal dependencies
 */
import './style.scss';
import Block from './block';
import blockAttributes from './attributes';
import { renderParentBlock } from './render-parent-block';

const getProps = ( el ) => {
	return {
		attributes: getValidBlockAttributes( blockAttributes, el.dataset ),
	};
};

renderParentBlock( {
	Block: withStoreCartApiHydration( withRestApiHydration( Block ) ),
	blockName: 'woocommerce/checkout-i2',
	selector: '.wp-block-woocommerce-checkout-i2',
	getProps,
} );
