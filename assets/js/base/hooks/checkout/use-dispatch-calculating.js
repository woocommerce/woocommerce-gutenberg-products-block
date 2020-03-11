/**
 * External dependencies
 */
import { useCheckoutContext } from '@woocommerce/base-context';
import { useEffect } from '@wordpress/element';

/**
 * This is a hook that receives a boolean indicating loading status for
 * something that triggers a recalculation of totals. This in turn will result
 * in a action dispatched to the checkout context for incrementing or
 * decrementing calculating count which is used to determine whether the entire
 * cart/checkout `isCalculating` or not.
 *
 * @param {boolean} loadingStatus A value that indicates loading status where
 *                                true results in checkout/cart calculating to
 *                                be incremented and false results in
 *                                checkout/cart calculating to be decremented.
 */
export const useDispatchCalculating = ( loadingStatus ) => {
	const { dispatchActions } = useCheckoutContext();

	useEffect( () => {
		return void ( loadingStatus
			? dispatchActions.incrementCalculating()
			: dispatchActions.decrementCalculating() );
	}, [ loadingStatus ] );
};
