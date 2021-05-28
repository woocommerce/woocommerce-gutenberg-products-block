/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useStoreCart } from '@woocommerce/base-context/hooks';
import {
	CheckoutProvider,
	StoreNoticesProvider,
	ValidationContextProvider,
} from '@woocommerce/base-context';
import BlockErrorBoundary from '@woocommerce/base-components/block-error-boundary';
import { CURRENT_USER_IS_ADMIN } from '@woocommerce/settings';
import { createInterpolateElement } from 'wordpress-element';
import { SidebarLayout } from '@woocommerce/base-components/sidebar-layout';

/**
 * Internal dependencies
 */
import EmptyCart from './empty-cart/index.js';

const reloadPage = () => void window.location.reload( true );

const Block = ( { children } ) => {
	const { cartItems, cartIsLoading } = useStoreCart();
	const noticeContext = 'woocommerce/checkout-i2';

	return (
		<CheckoutProvider>
			{ ! cartIsLoading && cartItems.length === 0 ? (
				<EmptyCart />
			) : (
				<BlockErrorBoundary
					header={ __(
						'Something went wrong…',
						'woo-gutenberg-products-block'
					) }
					text={ createInterpolateElement(
						__(
							'The checkout has encountered an unexpected error. <button>Try reloading the page</button>. If the error persists, please get in touch with us so we can assist.',
							'woo-gutenberg-products-block'
						),
						{
							button: (
								<button
									className="wc-block-link-button"
									onClick={ reloadPage }
								/>
							),
						}
					) }
					showErrorMessage={ CURRENT_USER_IS_ADMIN }
				>
					<StoreNoticesProvider context={ noticeContext }>
						<ValidationContextProvider>
							<SidebarLayout className="wc-block-checkout">
								{ children }
							</SidebarLayout>
						</ValidationContextProvider>
					</StoreNoticesProvider>
				</BlockErrorBoundary>
			) }
		</CheckoutProvider>
	);
};

export default Block;
