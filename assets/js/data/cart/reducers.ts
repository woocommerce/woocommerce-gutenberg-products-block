/**
 * External dependencies
 */
import type { CartItem } from '@woocommerce/types';

/**
 * Internal dependencies
 */
import { ACTION_TYPES as types } from './action-types';
import { defaultCartState, CartState } from '../default-states';
import type { CartAction } from './actions';

/**
 * Sub-reducer for cart items array.
 *
 * @param   {Array<CartItem>}  state   cartData.items state slice.
 * @param   {CartAction}  action  Action object.
 */
const cartItemsReducer = (
	state: Array< CartItem > = [],
	action: CartAction
) => {
	switch ( action.type ) {
		case types.RECEIVE_CART_ITEM:
			// Replace specified cart element with the new data from server.
			return state.map( ( cartItem ) => {
				if ( cartItem.key === action.cartItem?.key ) {
					return action.cartItem;
				}
				return cartItem;
			} );
	}
	return state;
};

/**
 * Reducer for receiving items related to the cart.
 *
 * @param   {CartState}  state   The current state in the store.
 * @param   {CartAction}  action  Action object.
 *
 * @return  {CartState}          New or existing state.
 */
const reducer = (
	state: CartState = defaultCartState,
	action: CartAction
): CartState => {
	switch ( action.type ) {
		case types.RECEIVE_ERROR:
			if ( action.error ) {
				state = {
					...state,
					errors: state.errors.concat( action.error ),
				};
			}
			break;
		case types.REPLACE_ERRORS:
			if ( action.error ) {
				state = {
					...state,
					errors: [ action.error ],
				};
			}
			break;
		case types.RECEIVE_CART:
			if ( action.response ) {
				state = {
					...state,
					errors: [],
					cartData: action.response,
				};
			}
			break;
		case types.APPLYING_COUPON:
			if ( action.couponCode ) {
				state = {
					...state,
					metaData: {
						...state.metaData,
						applyingCoupon: action.couponCode,
					},
				};
			}
			break;
		case types.REMOVING_COUPON:
			if ( action.couponCode ) {
				state = {
					...state,
					metaData: {
						...state.metaData,
						removingCoupon: action.couponCode,
					},
				};
			}
			break;

		case types.ITEM_PENDING_QUANTITY:
			// Remove key by default - handles isQuantityPending==false
			// and prevents duplicates when isQuantityPending===true.
			const keysPendingQuantity = state.cartItemsPendingQuantity.filter(
				( key ) => key !== action.cartItemKey
			);
			if ( action.isPendingQuantity && action.cartItemKey ) {
				keysPendingQuantity.push( action.cartItemKey );
			}
			state = {
				...state,
				cartItemsPendingQuantity: keysPendingQuantity,
			};
			break;
		case types.RECEIVE_REMOVED_ITEM:
			const keysPendingDelete = state.cartItemsPendingDelete.filter(
				( key ) => key !== action.cartItemKey
			);
			if ( action.isPendingDelete && action.cartItemKey ) {
				keysPendingDelete.push( action.cartItemKey );
			}
			state = {
				...state,
				cartItemsPendingDelete: keysPendingDelete,
			};
			break;
		// Delegate to cartItemsReducer.
		case types.RECEIVE_CART_ITEM:
			state = {
				...state,
				errors: [],
				cartData: {
					...state.cartData,
					items: cartItemsReducer( state.cartData.items, action ),
				},
			};
			break;
		case types.UPDATING_CUSTOMER_DATA:
			state = {
				...state,
				metaData: {
					...state.metaData,
					updatingCustomerData: !! action.isResolving,
				},
			};
			break;
		case types.UPDATING_SELECTED_SHIPPING_RATE:
			state = {
				...state,
				metaData: {
					...state.metaData,
					updatingSelectedRate: !! action.isResolving,
				},
			};
	}
	return state;
};

export default reducer;
