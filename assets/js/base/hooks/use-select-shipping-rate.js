/** @typedef { import('@woocommerce/type-defs/hooks').SelectedShippingRates } SelectedShippingRates */

/**
 * External dependencies
 */
import { useDispatch } from '@wordpress/data';
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';

/**
 * This is a custom hook for loading the selected shipping rate from the cart store and actions for selecting a rate.
 * See also: https://github.com/woocommerce/woocommerce-gutenberg-products-block/tree/master/src/RestApi/StoreApi
 *
 * @return {SelectedShippingRates} An object exposing data and actions from/for the
 * store api /cart/select-shipping endpoint.
 */
export const useSelectShippingRate = () => {
	const { selectShippingRate } = useDispatch( storeKey );
	return {
		selectShippingRate,
	};
};
