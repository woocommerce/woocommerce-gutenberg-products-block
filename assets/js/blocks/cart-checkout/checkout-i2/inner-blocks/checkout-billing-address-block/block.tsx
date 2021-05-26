/**
 * External dependencies
 */
import { useMemo } from '@wordpress/element';
import { useShippingDataContext } from '@woocommerce/base-context';
import {
	useStoreEvents,
	useCheckoutAddress,
} from '@woocommerce/base-context/hooks';
import { AddressForm } from '@woocommerce/base-components/cart-checkout';

/**
 * Internal dependencies
 */
import PhoneNumber from './phone-number';

const Block = (): JSX.Element => {
	const {
		defaultAddressFields,
		billingFields,
		setBillingFields,
		setPhone,
	} = useCheckoutAddress();
	const { needsShipping } = useShippingDataContext();
	const { dispatchCheckoutEvent } = useStoreEvents();

	// @todo where do these live?
	const requirePhoneField = true;
	const showPhoneField = true;
	const showCompanyField = true;
	const requireCompanyField = false;
	const showApartmentField = true;

	const addressFieldsConfig = useMemo( () => {
		return {
			company: {
				hidden: ! showCompanyField,
				required: requireCompanyField,
			},
			address_2: {
				hidden: ! showApartmentField,
			},
		};
	}, [ showCompanyField, requireCompanyField, showApartmentField ] );

	return (
		<>
			<AddressForm
				id="billing"
				type="billing"
				onChange={ ( values ) => {
					setBillingFields( values );
					dispatchCheckoutEvent( 'set-billing-address' );
				} }
				values={ billingFields }
				fields={ Object.keys( defaultAddressFields ) }
				fieldConfig={ addressFieldsConfig }
			/>
			{ showPhoneField && ! needsShipping && (
				<PhoneNumber
					isRequired={ requirePhoneField }
					value={ billingFields.phone }
					onChange={ ( value ) => {
						setPhone( value );
						dispatchCheckoutEvent( 'set-phone-number', {
							step: 'billing',
						} );
					} }
				/>
			) }
		</>
	);
};

export default Block;
