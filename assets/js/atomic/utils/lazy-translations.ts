/* eslint-disable no-console */
/**
 * External dependencies
 */
import md5 from 'md5';
import { setLocaleData } from '@wordpress/i18n';
import { blocksConfig } from '@woocommerce/block-settings';

export const loadChunkTranslations = ( file: string, domain: string ): void => {
	const hash = md5( `${ file }` );
	console.log( `loading translations for ${ file } (${ hash })` );
	window
		.fetch(
			blocksConfig.langDir +
				'/' +
				`${ domain }-${ blocksConfig.locale }-${ hash }.json`
		)
		.then( function ( jsonResponse ) {
			if ( jsonResponse && jsonResponse.ok ) {
				jsonResponse
					.json()
					.then( ( response ) => {
						setLocaleData( response.locale_data.messages, domain );
					} )
					.catch( () => {
						console.log( `Invalid translation for ${ file }` );
					} );
			}
		} );
};

export default loadChunkTranslations;
