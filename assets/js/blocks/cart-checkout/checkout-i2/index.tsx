/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon, card } from '@woocommerce/icons';
import { registerFeaturePluginBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import { Edit, Save } from './edit';
import { blockName, blockAttributes } from './attributes';
import './inner-blocks';
import './editor.scss';

const settings = {
	title: __( 'Checkout i2', 'woo-gutenberg-products-block' ),
	icon: {
		src: <Icon srcElement={ card } />,
		foreground: '#96588a',
	},
	category: 'woocommerce',
	keywords: [ __( 'WooCommerce', 'woo-gutenberg-products-block' ) ],
	description: __(
		'Display a checkout form so your customers can submit orders.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		multiple: false,
	},
	attributes: blockAttributes,
	apiVersion: 2,
	edit: Edit,
	save: Save,
};

registerFeaturePluginBlockType( blockName, settings );
