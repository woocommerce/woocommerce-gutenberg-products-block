/**
 * External dependencies
 */
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { useDispatchCalculating, useDispatchHasError } from '../checkout';

/** @typedef { import('@woocommerce/type-defs/hooks').StoreCart } StoreCart */

/**
 * @constant
 * @type  {StoreCart} Object containing cart data.
 */
const defaultCartData = {
	cartCoupons: [],
	cartItems: [],
	cartItemsCount: 0,
	cartItemsWeight: 0,
	cartNeedsShipping: true,
	cartTotals: {},
	cartIsLoading: true,
	cartErrors: [],
	shippingRates: [],
};

/**
 * This is a custom hook that is wired up to the `wc/store/cart` data
 * store.
 *
 * @param {Object} options                An object declaring the various
 *                                        collection arguments.
 * @param {boolean} options.shouldSelect  If false, the previous results will be
 *                                        returned and internal selects will not
 *                                        fire.
 *
 * @return {StoreCart} Object containing cart data.
 */
export const useStoreCart = ( options = { shouldSelect: true } ) => {
	const { shouldSelect } = options;

	const results = useSelect(
		( select ) => {
			if ( ! shouldSelect ) {
				return defaultCartData;
			}
			const store = select( storeKey );
			const cartData = store.getCartData();
			const cartErrors = store.getCartErrors();
			const cartTotals = store.getCartTotals();
			const cartIsLoading = ! store.hasFinishedResolution(
				'getCartData'
			);

			return {
				cartCoupons: cartData.coupons,
				shippingRates: cartData.shippingRates,
				cartItems: cartData.items,
				cartItemsCount: cartData.itemsCount,
				cartItemsWeight: cartData.itemsWeight,
				cartNeedsShipping: cartData.needsShipping,
				cartTotals,
				cartIsLoading,
				cartErrors,
			};
		},
		[ shouldSelect ]
	);

	// React to loading and error status dispatch checkout status updates.
	// Note these are done separately to avoid unnecessary dispatches.
	useDispatchHasError( results.cartErrors.length > 0 );
	useDispatchCalculating( results.cartIsLoading );

	return results;
};
