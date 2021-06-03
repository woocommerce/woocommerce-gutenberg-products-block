/**
 * External dependencies
 */
import { defaultAddressFields } from '@woocommerce/settings';
import { useEffect, useCallback, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	useShippingDataContext,
	useCustomerDataContext,
} from '../providers/cart-checkout';

/**
 * Custom hook for exposing address related functionality for the checkout address form.
 */
export const useCheckoutAddress = () => {
	const { needsShipping } = useShippingDataContext();
	const {
		billingData,
		setBillingData,
		shippingAddress,
		setShippingAddress,
		shippingAsBilling,
		setShippingAsBilling,
	} = useCustomerDataContext();

	const currentShippingAsBilling = useRef( shippingAsBilling );
	const previousBillingData = useRef( billingData );

	/**
	 * Sets shipping address data, and also billing if using the same address.
	 */
	const setShippingFields = useCallback(
		( value ) => {
			setShippingAddress( value );

			if ( shippingAsBilling ) {
				setBillingData( value );
			}
		},
		[ shippingAsBilling, setShippingAddress, setBillingData ]
	);

	/**
	 * Sets billing address data, and also shipping if shipping is disabled.
	 */
	const setBillingFields = useCallback(
		( value ) => {
			setBillingData( value );

			if ( ! needsShipping ) {
				setShippingAddress( value );
			}
		},
		[ needsShipping, setShippingAddress, setBillingData ]
	);

	// When the "Use same address" checkbox is toggled we need to update the current billing address to reflect this.
	// This either sets the billing address to the shipping address, or restores the billing address to it's previous state.
	useEffect( () => {
		if ( currentShippingAsBilling.current !== shippingAsBilling ) {
			if ( shippingAsBilling ) {
				previousBillingData.current = billingData;
				setBillingData( shippingAddress );
			} else {
				const {
					// We need to pluck out email and phone from previous billing data because they can be empty, causing the current email and phone to get emptied. See issue #4155
					/* eslint-disable no-unused-vars */
					email,
					/* eslint-enable no-unused-vars */
					...billingAddress
				} = previousBillingData.current;
				setBillingData( {
					...billingAddress,
				} );
			}
			currentShippingAsBilling.current = shippingAsBilling;
		}
	}, [ shippingAsBilling, setBillingData, shippingAddress, billingData ] );

	const setEmail = ( value ) =>
		void setBillingData( {
			email: value,
		} );

	const setPhone = ( value ) => void setBillingPhone( value );

	const setBillingPhone = ( value ) =>
		void setBillingData( {
			phone: value,
		} );

	const setShippingPhone = ( value ) =>
		void setShippingAddress( {
			phone: value,
		} );

	// Note that currentShippingAsBilling is returned rather than the current state of shippingAsBilling--this is so that
	// the billing fields are not rendered before sync (billing field values are debounced and would be outdated)
	return {
		defaultAddressFields,
		shippingFields: shippingAddress,
		setShippingFields,
		billingFields: billingData,
		setBillingFields,
		setEmail,
		setPhone,
		setBillingPhone,
		setShippingPhone,
		shippingAsBilling,
		setShippingAsBilling,
		showShippingFields: needsShipping,
		showBillingFields:
			! needsShipping || ! currentShippingAsBilling.current,
	};
};
