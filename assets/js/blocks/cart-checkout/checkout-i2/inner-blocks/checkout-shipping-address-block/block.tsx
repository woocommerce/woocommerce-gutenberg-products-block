/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useEffect } from '@wordpress/element';
import { AddressForm } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutAddress, useStoreEvents } from '@woocommerce/base-context';
import CheckboxControl from '@woocommerce/base-components/checkbox-control';

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
	showPhoneField: boolean;
	requireCompanyField: boolean;
	requirePhoneField: boolean;
} ): JSX.Element => {
	const {
		defaultAddressFields,
		setShippingFields,
		shippingFields,
		setShippingAsBilling,
		shippingAsBilling,
		setShippingPhone,
	} = useCheckoutAddress();
	const { dispatchCheckoutEvent } = useStoreEvents();

	// Clears data if fields are hidden.
	useEffect( () => {
		if ( ! showPhoneField ) {
			setShippingPhone( '' );
		}
	}, [ showPhoneField, setShippingPhone ] );

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
				id="shipping"
				type="shipping"
				onChange={ ( values: Record< string, unknown > ) => {
					setShippingFields( values );
					dispatchCheckoutEvent( 'set-shipping-address' );
				} }
				values={ shippingFields }
				fields={ Object.keys( defaultAddressFields ) }
				fieldConfig={ addressFieldsConfig }
			/>
			{ showPhoneField && (
				<PhoneNumber
					isRequired={ requirePhoneField }
					value={ shippingFields.phone }
					onChange={ ( value ) => {
						setShippingPhone( value );
						dispatchCheckoutEvent( 'set-phone-number', {
							step: 'shipping',
						} );
					} }
				/>
			) }
			<CheckboxControl
				className="wc-block-checkout__use-address-for-billing"
				label={ __(
					'Use same address for billing',
					'woo-gutenberg-products-block'
				) }
				checked={ shippingAsBilling }
				onChange={ ( checked: boolean ) =>
					setShippingAsBilling( checked )
				}
			/>
		</>
	);
};

export default Block;
