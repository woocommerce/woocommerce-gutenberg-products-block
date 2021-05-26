/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { AddressForm } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutAddress } from '@woocommerce/base-context';
import CheckboxControl from '@woocommerce/base-components/checkbox-control';

const Block = (): JSX.Element => {
	const {
		defaultAddressFields,
		setShippingFields,
		shippingFields,
		setShippingAsBilling,
		shippingAsBilling,
	} = useCheckoutAddress();

	return (
		<>
			<AddressForm
				id="shipping"
				type="shipping"
				onChange={ setShippingFields }
				values={ shippingFields }
				fields={ Object.keys( defaultAddressFields ) }
				fieldConfig={ {} }
			/>
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
