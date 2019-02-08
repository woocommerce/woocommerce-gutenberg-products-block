/**
 * External dependencies
 */
import { rawHandler } from '@wordpress/blocks';

describe( 'shortcode transforms', () => {
	beforeAll( () => {
		// Initialize the block store & register our blocks.
		require( '@wordpress/blocks/build/store' );
		require( '../product-best-sellers' );
	} );

	describe( 'Best Selling Products', () => {
		test( 'should match the basic shortcode', () => {
			const blocks = rawHandler( {
				HTML: '\n[products]',
			} );
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'woocommerce/product-best-sellers' );
			expect( blocks[ 0 ].attributes.columns ).toBe( 3 );
			expect( blocks[ 0 ].attributes.rows ).toBe( 4 );
		} );

		test( 'should match the a shortcode with a category', () => {
			const blocks = rawHandler( {
				HTML: '\n[products limit="6" columns="2" category="16"]',
			} );
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'woocommerce/product-best-sellers' );
			expect( blocks[ 0 ].attributes.columns ).toBe( 2 );
			expect( blocks[ 0 ].attributes.rows ).toBe( 3 );
			expect( blocks[ 0 ].attributes.categories ).toHaveLength( 1 );
			expect( blocks[ 0 ].attributes.categories[ 0 ] ).toBe( '16' );
			expect( blocks[ 0 ].attributes.catOperator ).toBe( 'any' );
		} );

		test( 'should match the a shortcode with a category', () => {
			const blocks = rawHandler( {
				HTML: '\n[products limit="6" columns="2" category="16" cat_operator="ANd"]',
			} );
			expect( blocks ).toHaveLength( 1 );
			expect( blocks[ 0 ].name ).toBe( 'woocommerce/product-best-sellers' );
			expect( blocks[ 0 ].attributes.columns ).toBe( 2 );
			expect( blocks[ 0 ].attributes.rows ).toBe( 3 );
			expect( blocks[ 0 ].attributes.categories ).toHaveLength( 1 );
			expect( blocks[ 0 ].attributes.categories[ 0 ] ).toBe( '16' );
			expect( blocks[ 0 ].attributes.catOperator ).toBe( 'all' );
		} );
	} );
} );
