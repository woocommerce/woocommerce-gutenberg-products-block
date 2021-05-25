/**
 * External dependencies
 */
import { registerExperimentalBlockType } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import attributes from './attributes';
import { Edit, Save } from './edit';
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
	attributes,
	apiVersion: 2,
	edit: Edit,
	save: Save,
};

registerExperimentalBlockType( 'woocommerce/checkout-contact-information', {
	...blockConfig,
} );
