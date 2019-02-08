/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import Gridicon from 'gridicons';
import { registerBlockType } from '@wordpress/blocks';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Block from './block';
import getShortcode from '../../utils/get-shortcode';
import sharedAttributes from '../../utils/shared-attributes';
import * as transforms from '../../utils/shared-transforms';

registerBlockType( 'woocommerce/product-best-sellers', {
	title: __( 'Best Selling Products', 'woo-gutenberg-products-block' ),
	icon: <Gridicon icon="stats-up-alt" />,
	category: 'layout',
	keywords: [ __( 'WooCommerce', 'woo-gutenberg-products-block' ) ],
	description: __(
		'Display a grid of your all-time best selling products.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes: {
		...sharedAttributes,
	},

	transforms: {
		from: [
			{
				type: 'shortcode',
				tag: 'products',
				attributes: {
					categories: transforms.categories,
					catOperator: transforms.catOperator,
					columns: transforms.columns,
					rows: transforms.rows,
				},
			},
		],
	},

	/**
	 * Renders and manages the block.
	 */
	edit( props ) {
		return <Block { ...props } />;
	},

	/**
	 * Save the block content in the post content. Block content is saved as a products shortcode.
	 *
	 * @return string
	 */
	save( props ) {
		const {
			align,
		} = props.attributes; /* eslint-disable-line react/prop-types */
		return (
			<RawHTML className={ align ? `align${ align }` : '' }>
				{ getShortcode( props, 'woocommerce/product-best-sellers' ) }
			</RawHTML>
		);
	},
} );
