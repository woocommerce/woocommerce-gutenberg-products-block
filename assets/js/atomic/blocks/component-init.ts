/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
declare let __webpack_public_path__: string;

/**
 * External dependencies
 */
import { registerBlockComponent } from '@woocommerce/blocks-registry';
import { lazy } from '@wordpress/element';
import { WC_BLOCKS_BUILD_URL, blocksConfig } from '@woocommerce/block-settings';
import { addRequireChunkTranslationsHandler } from '@woocommerce/base-utils';
import md5 from 'md5';

// Modify webpack publicPath at runtime based on location of WordPress Plugin.
// eslint-disable-next-line prefer-const
__webpack_public_path__ = WC_BLOCKS_BUILD_URL;

if ( blocksConfig.locale !== 'en_US' ) {
	addRequireChunkTranslationsHandler( {
		domain: 'woo-gutenberg-products-block',
		getTranslationChunkFileUrl: ( chunkId ) => {
			const hash = md5( `build/${ chunkId }.js` );
			return `${ blocksConfig.languageUrl }/woo-gutenberg-products-block-${ blocksConfig.locale }-${ hash }.json`;
		},
		translatedChunks: [
			'atomic-block-components/price-frontend',
			'atomic-block-components/image-frontend',
			'atomic-block-components/rating-frontend',
			'atomic-block-components/button-frontend',
			'atomic-block-components/summary-frontend',
			'atomic-block-components/sale-badge-frontend',
			'atomic-block-components/sku-frontend',
			'atomic-block-components/category-list-frontend',
			'atomic-block-components/tag-list-frontend',
			'atomic-block-components/stock-indicator-frontend',
			'atomic-block-components/add-to-cart-frontend',
		],
	} );
}

registerBlockComponent( {
	blockName: 'woocommerce/product-price',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/price" */
			'./product-elements/price/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-image',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/image" */
			'./product-elements/image/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-title',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/title" */
			'./product-elements/title/frontend'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-rating',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/rating" */
			'./product-elements/rating/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-button',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/button" */
			'./product-elements/button/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-summary',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/summary" */
			'./product-elements/summary/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-sale-badge',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/sale-badge" */
			'./product-elements/sale-badge/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-sku',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/sku" */
			'./product-elements/sku/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-category-list',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/category-list" */
			'./product-elements/category-list/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-tag-list',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/tag-list" */
			'./product-elements/tag-list/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-stock-indicator',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/stock-indicator" */
			'./product-elements/stock-indicator/block'
		)
	),
} );

registerBlockComponent( {
	blockName: 'woocommerce/product-add-to-cart',
	component: lazy( () =>
		import(
			/* webpackChunkName: "atomic-block-components/add-to-cart" */
			'./product-elements/add-to-cart/frontend'
		)
	),
} );
