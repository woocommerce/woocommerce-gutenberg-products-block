/**
 * External dependencies
 */
import {
	createNewPost,
	getAllBlocks,
	insertBlock,
	publishPost,
	switchUserToAdmin,
	trashAllPosts,
	visitAdminPage,
} from '@wordpress/e2e-test-utils';

import { visitBlockPage } from '@woocommerce/blocks-test-utils';

// // Publish a new page containing the checkout block.
// async function publishBlockCheckoutPage( ) {

// 		await createNewPost( { postType: 'page', title } );
// 		await insertBlock( title.replace( /block/i, '' ).trim() );
// 		const pageContent = await getEditedPostContent();
// 		await outputFile(
// 			`${ dirname(
// 				// we want to fetch the path of the test file who triggered this function
// 				// this could be two levels up, or one level up, depending on how you launch the test.
// 				module.parent.parent.filename ||
// 					module.parent.filename ||
// 					module.filename
// 			) }/__fixtures__/${ kebabCase(
// 				title.replace( /block/i, '' ).trim()
// 			) }.fixture.json`,
// 			JSON.stringify( {
// 				title,
// 				pageContent,
// 			} )
// 		);
// 	}
// }

if ( process.env.WP_VERSION < 5.3 || process.env.WOOCOMMERCE_BLOCKS_PHASE < 2 )
	// eslint-disable-next-line jest/no-focused-tests
	test.only( `skipping ${ block.name } tests`, () => {} );

const testPageTitle = 'Rua magical test page';

describe( 'rua experimental test', () => {
	it( 'can create a page with checkout block', async () => {
		await switchUserToAdmin();
		// Delete ALL posts so it's easier to find our one (!)
		await trashAllPosts();
		await createNewPost( { postType: 'page', title: testPageTitle } );
		await insertBlock( 'Checkout' );
		// expect( await getAllBlocks() ).toHaveLength( 1 );
		// await publishPost();
		// Visit posts list and click view for first page.
		// await visitAdminPage( 'edit.php', 'post_type=page' );
		// await page.click( 'table.pages tbody tr .row-actions .view a' );
		// await page.waitForNavigation( { waitUntil: 'domcontentloaded' } );
		// Confirm that the page title is as expected
		// Placeholder expect
		// expect( 1 ).toBe( 1 );
	} );
} );
