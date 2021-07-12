/**
 * External dependencies
 */
import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import { registerBlockComponent } from '@woocommerce/blocks-registry';
type RegistredBlocks = { totals: Array< string >; fields: Array< string > };

let registeredBlocks: RegistredBlocks = {
	totals: [],
	fields: [],
};

export const addToCheckoutArea = (
	area: keyof RegistredBlocks,
	blockName: string
): void | Error => {
	if ( ! registeredBlocks.hasOwnProperty( area ) ) {
		throw new Error(
			`Incorrect value for the "area" argument when registering the checkout block. It was a ${ area }, but must be one of ${ Object.keys(
				registeredBlocks
			).join( ', ' ) }.`
		);
	}
	registeredBlocks = {
		...registeredBlocks,
		[ area ]: [ ...registeredBlocks[ area ], blockName ],
	};
};

export const getRegisteredBlocks = (
	area: keyof RegistredBlocks
): Array< string > => {
	return registeredBlocks[ area ];
};

export const registerCheckoutBlock = (
	blockName: string,
	{
		block: Block,
		area,
		...config
	}: {
		block: JSX.Element;
		area: keyof RegistredBlocks;
		config: BlockConfiguration;
	}
): void => {
	registerBlockType( blockName, {
		...config,
		category: 'woocommerce',
	} );
	addToCheckoutArea( area, blockName );
	registerBlockComponent( {
		blockName,
		component: Block,
	} );
};
