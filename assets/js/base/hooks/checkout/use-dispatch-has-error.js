/**
 * External dependencies
 */
import { useCheckoutContext } from '@woocommerce/base-context';
import { useEffect } from '@wordpress/element';

/**
 * This is a hook that receives a boolean indicating error status for
 * something that triggers a flipping the error status state of checkout context.
 *
 * @param {boolean} errorStatus   A value that indicates error status where
 *                                true results in checkout error status to be
 *                                flipped to true and false results in checkout
 *                                error status to be flipped to false.
 */
export const useDispatchHasError = ( errorStatus ) => {
	const { dispatchActions } = useCheckoutContext();

	useEffect( () => {
		return void ( errorStatus
			? dispatchActions.setHasError()
			: dispatchActions.clearError() );
	}, [ errorStatus ] );
};
