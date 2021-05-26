/**
 * External dependencies
 */
import {
	CheckoutProvider,
	StoreNoticesProvider,
} from '@woocommerce/base-context';

/** @typedef {import('react')} React */

/**
 * The Single Product Block.
 *
 * @param {Object} props Incoming props for the component.
 * @param {React.ReactChildren} props.children
 */
const Block = ( { children } ) => {
	const noticeContext = 'woocommerce/checkout-i2';

	return (
		<CheckoutProvider>
			<StoreNoticesProvider context={ noticeContext }>
				{ children }
			</StoreNoticesProvider>
		</CheckoutProvider>
	);
};

export default Block;
