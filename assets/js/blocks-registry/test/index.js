/**
 * Internal dependencies
 */
import { getRegisteredInnerBlocks, registerInnerBlock } from '../index';

describe( 'blocks registry', () => {
	const main = '@woocommerce/all-products';
	const blockName = '@woocommerce-extension/price-level';
	const component = () => {};

	describe( 'registerInnerBlock', () => {
		const invokeTest = ( args ) => () => {
			return registerInnerBlock( args );
		};
		it( 'throws an error when registered blocks is missing `main`', () => {
			expect( invokeTest( { main: null } ) ).toThrowError(
				/parent name/
			);
		} );
		it( 'throws an error when registered blocks is missing `blockName`', () => {
			expect( invokeTest( { main, blockName: null } ) ).toThrowError(
				/block name/
			);
		} );
		it( 'throws an error when registered blocks is missing `component`', () => {
			expect(
				invokeTest( { main, blockName, component: null } )
			).toThrowError( /component/ );
		} );
	} );

	describe( 'getRegisteredInnerBlocks', () => {
		it( 'gets an empty object when parent has no inner blocks', () => {
			expect(
				getRegisteredInnerBlocks( '@woocommerce/all-products' )
			).toEqual( {} );
		} );
		it( 'gets a block that was successfully registerd', () => {
			registerInnerBlock( { main, blockName, component } );
			expect(
				getRegisteredInnerBlocks( '@woocommerce/all-products' )
			).toEqual( { [ blockName ]: component } );
		} );
	} );
} );
