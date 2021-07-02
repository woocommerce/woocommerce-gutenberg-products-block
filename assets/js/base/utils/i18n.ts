/* eslint-disable no-console */
/**
 * External dependencies
 */
import { setLocaleData } from '@wordpress/i18n';
import { fetchDedupe } from 'fetch-dedupe';

interface RequireChunkCallback {
	add: (
		callback: (
			props: { scriptSrc: string; publicPath: string },
			promises: Promise< unknown >[]
		) => void
	) => this;
}

declare let __requireChunkCallback__: RequireChunkCallback;

/**
 * Adds require chunk handler for fetching translations.
 */
export const addRequireChunkTranslationsHandler = (
	options: {
		// Callback function to get the file name from the ChunkId or false if the translation file doesn't exist.
		getTranslationChunkFileUrl?: ( chunkId: string ) => string | false;
		// Text domain.
		domain?: string;
		// Array of chunk ids that should have available translations.
		translatedChunks?: string[];
	} = {}
): void => {
	if ( typeof __requireChunkCallback__ === 'undefined' ) {
		return;
	}
	const {
		domain = 'default',
		getTranslationChunkFileUrl,
		translatedChunks = [],
	} = options;

	if ( ! getTranslationChunkFileUrl ) {
		return;
	}
	const loadedTranslationChunks = {} as Record< string, boolean >;

	const handler = (
		{ scriptSrc, publicPath }: { scriptSrc: string; publicPath: string },
		promises: Promise< unknown >[]
	) => {
		const chunkId = scriptSrc
			.replace( publicPath, '' )
			.replace( /\.js$/, '' );

		if (
			! translatedChunks.includes( chunkId ) ||
			loadedTranslationChunks[ chunkId ]
		) {
			return;
		}
		const translationChunkFileUrl = getTranslationChunkFileUrl( chunkId );

		if ( ! translationChunkFileUrl ) {
			return;
		}
		const translationChunkPromise = fetchDedupe(
			getTranslationChunkFileUrl( chunkId )
		)
			.then(
				( translations: {
					ok: boolean;
					data: {
						// eslint-disable-next-line camelcase
						locale_data: { messages: Record< string, string > };
					};
				} ) => {
					setLocaleData(
						translations.data?.locale_data?.messages,
						domain
					);
					loadedTranslationChunks[ chunkId ] = true;
				}
			)
			.catch( ( error: { message: string } ) => {
				console.log( error.message );
			} );

		promises.push( translationChunkPromise );
	};

	__requireChunkCallback__.add( handler );
};
