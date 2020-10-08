/**
 * External dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { CHECKOUT_ALLOWS_SIGNUP } from '@woocommerce/block-settings';
/**
 * Internal dependencies
 */
import sharedConfig from '../shared/config';
import edit from './edit';
import {
	BLOCK_TITLE as title,
	BLOCK_ICON as icon,
	BLOCK_DESCRIPTION as description,
} from './constants';

const blockConfig = {
	title,
	description,
	icon: {
		src: icon,
		foreground: '#874FB9',
	},
	edit,
	attributes: {
		showCompanyField: {
			type: 'boolean',
			default: false,
		},
		requireCompanyField: {
			type: 'boolean',
			default: false,
		},
		allowCreateAccount: {
			type: 'boolean',
			default: CHECKOUT_ALLOWS_SIGNUP,
		},
		showApartmentField: {
			type: 'boolean',
			default: true,
		},
		showPhoneField: {
			type: 'boolean',
			default: true,
		},
		requirePhoneField: {
			type: 'boolean',
			default: false,
		},
	},
};

registerBlockType( 'woocommerce/address-step', {
	...sharedConfig,
	...blockConfig,
} );
