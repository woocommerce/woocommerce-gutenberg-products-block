/**
 * External dependencies
 */
import withFilteredAttributes from '@woocommerce/base-hocs/with-filtered-attributes';
import { FormStep } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutContext } from '@woocommerce/base-context';
import { useCheckoutAddress } from '@woocommerce/base-context/hooks';

/**
 * Internal dependencies
 */
import Block from './block';
import attributes from './attributes';

const FrontendBlock = ( {
	title,
	description,
	requireCompanyField,
	showApartmentField,
	showCompanyField,
	showPhoneField,
	requirePhoneField,
	showStepNumber,
}: {
	title: string;
	description: string;
	requireCompanyField: boolean;
	showApartmentField: boolean;
	showCompanyField: boolean;
	showPhoneField: boolean;
	requirePhoneField: boolean;
	showStepNumber: boolean;
} ): JSX.Element | null => {
	const { isProcessing: checkoutIsProcessing } = useCheckoutContext();
	const { showBillingFields } = useCheckoutAddress();

	if ( ! showBillingFields ) {
		return null;
	}

	return (
		<FormStep
			id="billing-fields"
			disabled={ checkoutIsProcessing }
			className="wc-block-checkout__billing-fields"
			title={ title }
			description={ description }
			showStepNumber={ showStepNumber }
		>
			<Block
				requireCompanyField={ requireCompanyField }
				showApartmentField={ showApartmentField }
				showCompanyField={ showCompanyField }
				showPhoneField={ showPhoneField }
				requirePhoneField={ requirePhoneField }
			/>
		</FormStep>
	);
};

export default withFilteredAttributes( attributes )( FrontendBlock );
