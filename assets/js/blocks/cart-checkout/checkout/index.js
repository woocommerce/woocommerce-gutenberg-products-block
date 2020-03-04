/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { Icon, card } from '@woocommerce/icons';

/**
 * Internal dependencies
 */
import edit from './edit';
import { example } from './example';
import './editor.scss';

const settings = {
	title: __( 'Checkout', 'woo-gutenberg-products-block' ),
	icon: {
		src: <Icon srcElement={ card } />,
		foreground: '#96588a',
	},
	category: 'woocommerce',
	keywords: [ __( 'WooCommerce', 'woo-gutenberg-products-block' ) ],
	description: __(
		'Display the checkout experience for customers.',
		'woo-gutenberg-products-block'
	),
	supports: {
		align: [ 'wide', 'full' ],
		html: false,
		multiple: false,
	},
	example,
	attributes: {
		/**
		 * Are we previewing?
		 */
		isPreview: {
			type: 'boolean',
			default: false,
		},
		useShippingAsBilling: {
			type: 'boolean',
			default: true,
		},
		showCompanyField: {
			type: 'boolean',
			default: true,
		},
	},
	edit,
	/**
	 * Save the props to post content.
	 */
	save( { attributes } ) {
		const {
			className,
			useShippingAsBilling,
			showCompanyField,
		} = attributes;
		const data = {
			'data-use-shipping-as-billing': useShippingAsBilling,
			'data-show-company-field': showCompanyField,
		};
		return (
			<div className={ className } { ...data }>
				Checkout block coming soon to store near you
			</div>
		);
	},
};

if ( process.env.WOOCOMMERCE_BLOCKS_PHASE === 'experimental' ) {
	registerBlockType( 'woocommerce/checkout', settings );
}
