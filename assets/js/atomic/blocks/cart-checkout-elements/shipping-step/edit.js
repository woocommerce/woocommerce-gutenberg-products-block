/**
 * External dependencies
 */
import { CheckoutProvider } from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
import Block from './block';

const Edit = ( { attributes } ) => {
	return (
		<CheckoutProvider>
			<Block { ...attributes } />
		</CheckoutProvider>
	);
};

export default Edit;
