/**
 * External dependencies
 */
import withFilteredAttributes from '@woocommerce/base-hocs/with-filtered-attributes';
import { FormStep } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutContext } from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
import Block from './block';
import attributes from './attributes';
import LoginPrompt from './login-prompt';

const FrontendBlock = ( {
	title,
	description,
	allowCreateAccount,
	showStepNumber,
}: {
	title: string;
	description: string;
	allowCreateAccount: boolean;
	showStepNumber: boolean;
} ) => {
	const { isProcessing: checkoutIsProcessing } = useCheckoutContext();

	return (
		<FormStep
			id="contact-fields"
			disabled={ checkoutIsProcessing }
			className="wc-block-checkout__contact-fields"
			title={ title }
			description={ description }
			showStepNumber={ showStepNumber }
			stepHeadingContent={ () => <LoginPrompt /> }
		>
			<Block allowCreateAccount={ allowCreateAccount } />
		</FormStep>
	);
};

export default withFilteredAttributes( attributes )( FrontendBlock );
