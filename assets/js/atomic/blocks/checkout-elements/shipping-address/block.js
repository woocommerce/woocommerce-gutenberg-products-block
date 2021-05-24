/**
 * External dependencies
 */
import { AddressForm } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutAddress } from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
import './style.scss';

const Block = ( {} ) => {
	const {
		defaultAddressFields,
		setShippingFields,
		shippingFields,
	} = useCheckoutAddress();

	return (
		<AddressForm
			id="shipping"
			type="shipping"
			onChange={ setShippingFields }
			values={ shippingFields }
			fields={ Object.keys( defaultAddressFields ) }
			fieldConfig={ {} }
		/>
	);
};

export default Block;
