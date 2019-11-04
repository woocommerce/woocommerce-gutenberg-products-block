/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit.js';
import { IconMoney } from '../../components/icons';

registerBlockType( 'woocommerce/attribute-filter', {
	title: __( 'Filter Products by Attribute', 'woo-gutenberg-products-block' ),
	icon: {
		src: <IconMoney />,
		foreground: '#96588a',
	},
	category: 'woocommerce',
	keywords: [ __( 'WooCommerce', 'woo-gutenberg-products-block' ) ],
	description: __(
		'Display a list of filters based on a chosen product attribute.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: [ 'wide', 'full' ],
	},
	attributes: {
		attributeId: {
			type: 'number',
			default: 1, // @todo
		},
		showCounts: {
			type: 'boolean',
			default: true,
		},
		displayStyle: {
			type: 'string',
			default: 'list',
		},
		queryType: {
			type: 'string',
			default: 'and',
		},
	},
	edit,
	/**
	 * Save the props to post content.
	 */
	save( { attributes } ) {
		const { showCounts, displayStyle, queryType } = attributes;
		const data = {
			'data-showcounts': showCounts,
			'data-displaystyle': displayStyle,
			'data-querytype': queryType,
		};
		return (
			<div className="is-loading" { ...data }>
				<span
					aria-hidden
					className="wc-block-product-attribute-filter__placeholder"
				/>
			</div>
		);
	},
} );
