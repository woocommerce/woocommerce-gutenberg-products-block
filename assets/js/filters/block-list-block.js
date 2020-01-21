/**
 * External dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
const { getBlockType } = wp.blocks;
const { addFilter } = wp.hooks;

/**
 * withDefaultAttributes HOC for editor.BlockListBlock. This sets defaults
 * when a block is loaded.
 *
 *  @param	object BlockListBlock The BlockListBlock element.
 */
const withDefaultAttributes = createHigherOrderComponent(
	( BlockListBlock ) => {
		return function( props ) {
			const blockType = getBlockType( props.block.name );

			if ( blockType.name.startsWith( 'woocommerce/' ) ) {
				Object.keys( blockType.attributes ).map( ( key ) => {
					if (
						typeof props.attributes[ key ] === 'undefined' &&
						typeof blockType.defaults !== 'undefined' &&
						typeof blockType.defaults[ key ] !== 'undefined'
					) {
						props.attributes[ key ] = blockType.defaults[ key ];
					}
					return key;
				} );
			}

			return <BlockListBlock { ...props } />;
		};
	},
	'withDefaultAttributes'
);

/**
 * Hook into `editor.BlockListBlock` to set default attributes (if blocks
 * define them separately) when a block is inserted.
 *
 * This is a workaround for Gutenberg which does not save "default" attributes
 * to the post, which means if defaults change, all existing blocks change too.
 *
 * See https://github.com/WordPress/gutenberg/issues/7342
 *
 * To use this, the block name needs a `woocommerce/` prefix, and as well
 * as defining `attributes` during block registration, you must also declare an
 * array called `defaults`. Defaults should be omitted from `attributes`.
 */
addFilter(
	'editor.BlockListBlock',
	'woocommerce-blocks/block-list-block',
	withDefaultAttributes
);
