/**
 * External dependencies
 */
import { StoreNoticesProvider } from '@woocommerce/base-context';
import { useStoreCart, useEmitResponse } from '@woocommerce/base-context/hooks';

/**
 * Internal dependencies
 */
import { PaymentMethods } from '../../../payment-methods';

const Block = (): JSX.Element | null => {
	const { cartNeedsPayment } = useStoreCart();
	const { noticeContexts } = useEmitResponse();

	if ( ! cartNeedsPayment ) {
		return null;
	}

	return (
		<StoreNoticesProvider context={ noticeContexts.PAYMENTS }>
			<PaymentMethods />
		</StoreNoticesProvider>
	);
};

export default Block;
