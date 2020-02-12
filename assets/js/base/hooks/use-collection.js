/**
 * External dependencies
 */
import { COLLECTIONS_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { useSelect } from '@wordpress/data';
import { useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useShallowEqual } from './use-shallow-equal';

/**
 * Check if the store needs invalidating due to a change in last modified headers.
 *
 * @param {*} store Store object.
 * @param {*} dispatch Store dispatcher.
 */
const invalidateModifiedStore = ( store, dispatch ) => {
	if (
		store.getCollectionPreviousLastModified() &&
		store.getCollectionLastModified() >
			store.getCollectionPreviousLastModified()
	) {
		// reset previous last modified to last modified to prevent this
		// running multiple times.
		dispatch( storeKey ).resetLastModified();
		dispatch( storeKey ).invalidateResolutionForStoreSelector(
			'getCollection'
		);
	}
};

/**
 * Check if the store needs invalidating due to a change in last modified headers.
 *
 * @param {*} store 			Store object.
 * @param {*} dispatch 			Store dispatcher.
 * @param {number} freshness 	How many milliseconds must elapse for data to
 * 								be considered stale.
 */
const invalidateStaleStore = ( store, dispatch, freshness ) => {
	if ( ! store.getCollectionTimestamp() ) {
		dispatch( storeKey ).updateTimestamp( Date.now() );
		return;
	}
	if (
		freshness &&
		store.getCollectionTimestamp() + freshness < Date.now()
	) {
		dispatch( storeKey ).updateTimestamp( Date.now() );
		dispatch( storeKey ).invalidateResolutionForStoreSelector(
			'getCollection'
		);
	}
};

/**
 * This is a custom hook that is wired up to the `wc/store/collections` data
 * store. Given a collections option object, this will ensure a component is
 * kept up to date with the collection matching that query in the store state.
 *
 * @throws {Object} Throws an exception object if there was a problem with the
 * 					API request, to be picked up by BlockErrorBoundry.
 *
 * @param {Object} options                An object declaring the various
 *                                        collection arguments.
 * @param {string} options.namespace      The namespace for the collection.
 *                                        Example: `'/wc/blocks'`
 * @param {string} options.resourceName   The name of the resource for the
 *                                        collection. Example:
 *                                        `'products/attributes'`
 * @param {Array}  options.resourceValues An array of values (in correct order)
 *                                        that are substituted in the route
 *                                        placeholders for the collection route.
 *                                        Example: `[10, 20]`
 * @param {Object} options.query          An object of key value pairs for the
 *                                        query to execute on the collection
 *                                        (optional). Example:
 *                                        `{ order: 'ASC', order_by: 'price' }`
 * @param {boolean} options.shouldSelect  If false, the previous results will be
 *                                        returned and internal selects will not
 *                                        fire.
 * @param {number} freshness      	      How many milliseconds must elapse for
 *                                        data to be considered stale.
 *                                        Default 600000 (10 min).
 *
 * @return {Object} This hook will return an object with two properties:
 *                  - results   An array of collection items returned.
 *                  - isLoading A boolean indicating whether the collection is
 *                              loading (true) or not.
 */
export const useCollection = ( options, freshness = 600000 ) => {
	const {
		namespace,
		resourceName,
		resourceValues = [],
		query = {},
		shouldSelect = true,
	} = options;
	if ( ! namespace || ! resourceName ) {
		throw new Error(
			'The options object must have valid values for the namespace and ' +
				'the resource properties.'
		);
	}
	const currentResults = useRef( { results: [], isLoading: true } );
	// ensure we feed the previous reference if it's equivalent
	const currentQuery = useShallowEqual( query );
	const currentResourceValues = useShallowEqual( resourceValues );
	const [ , setState ] = useState();
	const results = useSelect(
		( select, { dispatch } ) => {
			if ( ! shouldSelect ) {
				return null;
			}
			const store = select( storeKey );

			invalidateModifiedStore( store, dispatch );
			invalidateStaleStore( store, dispatch, freshness );

			const args = [
				namespace,
				resourceName,
				currentQuery,
				currentResourceValues,
			];

			// is there an error? if so return it.
			const error = store.getCollectionError( ...args );
			if ( error ) {
				// Throw an exception within setState - this is needed because
				// this is a hook (https://github.com/facebook/react/issues/14981).
				setState( () => {
					throw error;
				} );
			}

			// Maybe invalidate existing caches.
			if (
				store.getCollectionPreviousLastModified() &&
				store.getCollectionLastModified() >
					store.getCollectionPreviousLastModified()
			) {
				// reset previous last modified to last modified to prevent this
				// running multiple times.
				dispatch( storeKey ).resetLastModified();
				dispatch( storeKey ).invalidateResolutionForStoreSelector(
					'getCollection'
				);
			}

			return {
				results: store.getCollection( ...args ),
				isLoading: ! store.hasFinishedResolution(
					'getCollection',
					args
				),
			};
		},
		[
			namespace,
			resourceName,
			currentResourceValues,
			currentQuery,
			shouldSelect,
		]
	);
	// if selector was not bailed, then update current results. Otherwise return
	// previous results
	if ( results !== null ) {
		currentResults.current = results;
	}
	return currentResults.current;
};
