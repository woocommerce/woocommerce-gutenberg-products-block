/**
 * External dependencies
 */
import classnames from 'classnames';
import {
	AddressForm,
	FormStep,
} from '@woocommerce/base-components/cart-checkout';
import {
	useCheckoutAddress,
	useCheckoutContext,
} from '@woocommerce/base-context';

const Block = ( {
	attributes: { title = '', description = '', showStepNumber = true },
}: {
	attributes: { title: string; description: string; showStepNumber: boolean };
} ): JSX.Element => {
	const {
		defaultAddressFields,
		setShippingFields,
		shippingFields,
	} = useCheckoutAddress();
	const { isProcessing: checkoutIsProcessing } = useCheckoutContext();

	return (
		<FormStep
			id="shipping-fields"
			disabled={ checkoutIsProcessing }
			className={ classnames(
				'wc-block-checkout__shipping-fields',
				'wc-block-components-checkout-step',
				{
					'wc-block-components-checkout-step--with-step-number': showStepNumber,
				}
			) }
			title={ title }
			description={ description }
		>
			<AddressForm
				id="shipping"
				type="shipping"
				onChange={ setShippingFields }
				values={ shippingFields }
				fields={ Object.keys( defaultAddressFields ) }
				fieldConfig={ {} }
			/>
		</FormStep>
	);
};

export default Block;
