/**
 * External dependencies
 */
import { switchUserToAdmin } from '@wordpress/e2e-test-utils';

import { visitBlockPage } from '@woocommerce/blocks-test-utils';

const block = {
	name: 'All Reviews',
	slug: 'woocommerce/all-reviews',
	class: '.wc-block-all-reviews',
};

describe( `${ block.name } Block`, () => {
	beforeAll( async () => {
		await switchUserToAdmin();
		await visitBlockPage( `${ block.name } Block` );
	} );

	it( 'renders without crashing', async () => {
		await expect( page ).toRenderBlock( block );
	} );

	it( 'shows reviews', async () => {
		await page.waitForSelector( '.wc-block-all-reviews' );
		const list = await page.$eval(
			'.wc-block-all-reviews',
			( e ) => e.innerHTML
		);
		console.log( list );
		await page.waitForSelector(
			'.wc-block-components-review-list .wc-block-components-review-list-item__item:not(.is-loading)'
		);
		expect(
			await page.$$eval(
				'.wc-block-components-review-list .wc-block-components-review-list-item__item',
				( reviews ) => reviews.length
			)
		).toBeGreaterThanOrEqual( 6 ); // Fixture data has three reviews per product.
	} );
} );
