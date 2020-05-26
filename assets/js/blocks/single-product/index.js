/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import attributes from './attributes';
import './style.scss';
import {
	BLOCK_NAME,
	BLOCK_TITLE,
	BLOCK_ICON,
	BLOCK_DESCRIPTION,
} from './constants';

const settings = {
	title: BLOCK_TITLE,
	icon: {
		src: BLOCK_ICON,
		foreground: '#96588a',
	},
	category: 'woocommerce',
	keywords: [ __( 'WooCommerce', 'woo-gutenberg-products-block' ) ],
	description: BLOCK_DESCRIPTION,
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
	},
	example: {
		attributes: {
			isPreview: true,
		},
	},
	attributes,
	edit,
	save,
};

registerBlockType( BLOCK_NAME, settings );
