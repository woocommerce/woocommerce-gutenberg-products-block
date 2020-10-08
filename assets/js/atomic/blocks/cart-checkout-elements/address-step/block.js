import { CheckoutProvider } from '@woocommerce/base-context';
/**
 * Internal dependencies
 */
import AddressStep from '../form-components/address-step';
const Block = ( props ) => {
	return (
		<CheckoutProvider>
			<AddressStep { ...props } />
		</CheckoutProvider>
	);
};

export default Block;
