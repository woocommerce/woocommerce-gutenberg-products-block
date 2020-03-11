/** @typedef { import('@woocommerce/type-defs/hooks').StoreCart } StoreCart */

/**
 * External dependencies
 */
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { useSelect } from '@wordpress/data';
import { useCartContext } from '@woocommerce/base-context';
import { previewCart } from '@woocommerce/resource-previews';
import { camelCase, mapKeys } from 'lodash';

/**
 * @constant
 * @type  {StoreCart} Object containing cart data.
 */
const defaultCartData = {
	cartCoupons: [],
	shippingRates: [],
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
	const { isEditor } = useCartContext();
	const { shouldSelect } = options;

	const results = useSelect(
		( select ) => {
			if ( ! shouldSelect ) {
				return null;
			}

			if ( isEditor ) {
				// Convert keys to camelCase like the reducer in the cart data store.
				const cartData = mapKeys( previewCart, ( _, key ) =>
					camelCase( key )
				);
				return {
					cartCoupons: cartData.coupons,
					shippingRates: cartData.shippingRates,
					cartItems: cartData.items,
					cartItemsCount: cartData.itemsCount,
					cartItemsWeight: cartData.itemsWeight,
					cartNeedsShipping: cartData.needsShipping,
					cartTotals: previewCart.totals,
					cartIsLoading: false,
					cartErrors: [],
				};
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
	if ( results === null ) {
		return defaultCartData;
	}
	return results;
};
