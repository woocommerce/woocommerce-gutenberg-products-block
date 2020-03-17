/**
 * External dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { usePrevious } from '@woocommerce/base-hooks';
import { useDebounce } from 'use-debounce';

/**
 * Internal dependencies
 */
import { useStoreCart } from './use-store-cart';

/**
 * @typedef {import('@woocommerce/type-defs/hooks').StoreCartItemQuantity} StoreCartItemQuantity
 * @typedef {import('@woocommerce/type-defs/cart').CartItem} CartItem
 */

/**
 * This is a custom hook for loading the Store API /cart/ endpoint and
 * actions for removing or changing item quantity.
 *
 * @see https://github.com/woocommerce/woocommerce-gutenberg-products-block/tree/master/src/RestApi/StoreApi
 *
 * @param {CartItem} cartItem      The cartItem to get quantity info from and
 *                                 will have quantity updated on.
 * @return {StoreCartItemQuantity} An object exposing data and actions relating
 *                                 to cart items.
 */
export const useStoreCartItemQuantity = ( cartItem ) => {
	const { key: cartItemKey = '', quantity: cartItemQuantity = 1 } = cartItem;
	const { cartErrors } = useStoreCart();
	// Store quantity in hook state. This is used to keep the UI
	// updated while server request is updated.
	const [ quantity, changeQuantity ] = useState( cartItemQuantity );
	const [ debouncedQuantity ] = useDebounce( quantity, 400 );
	const previousDebouncedQuantity = usePrevious( debouncedQuantity );
	const { removeItemFromCart, changeCartItemQuantity } = useDispatch(
		storeKey
	);

	const isPending = useSelect(
		( select ) => {
			if ( ! cartItemKey ) {
				return false;
			}
			const store = select( storeKey );
			return store.isItemQuantityPending( cartItemKey );
		},
		[ cartItemKey ]
	);

	const removeItem = () => {
		return cartItemKey ? removeItemFromCart( cartItemKey ) : false;
	};

	// Observe debounced quantity value, fire action to update server on change.
	useEffect( () => {
		// Don't run it if quantity didn't change but it was set for the first time.
		if ( cartItemKey && Number.isFinite( previousDebouncedQuantity ) ) {
			changeCartItemQuantity( cartItemKey, debouncedQuantity );
		}
	}, [ debouncedQuantity, cartItemKey ] );

	return {
		isPending,
		quantity,
		changeQuantity,
		removeItem,
		cartItemQuantityErrors: cartErrors,
	};
};
