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
import PhoneNumber from '../../phone-number';

const Block = ( {
	showCompanyField = false,
	showApartmentField = false,
	showPhoneField = false,
	requireCompanyField = false,
	requirePhoneField = false,
}: {
	showCompanyField: boolean;
	showApartmentField: boolean;
	showPhoneField?: boolean;
	requireCompanyField: boolean;
	requirePhoneField?: boolean;
} ): JSX.Element => {
	const {
		defaultAddressFields,
		billingFields,
		setBillingFields,
		setPhone,
	} = useCheckoutAddress();
	const { needsShipping } = useShippingDataContext();
	const { dispatchCheckoutEvent } = useStoreEvents();

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
