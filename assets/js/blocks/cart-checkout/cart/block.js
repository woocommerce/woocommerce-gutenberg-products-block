/**
 * External dependencies
 */
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { dispatch } from '@wordpress/data';
import { useStoreCart } from '@woocommerce/base-hooks';
import { useEffect, RawHTML } from '@wordpress/element';
import LoadingMask from '@woocommerce/base-components/loading-mask';
import {
	ValidationContextProvider,
	CartProvider,
} from '@woocommerce/base-context';
import { translateJQueryEventToNative } from '@woocommerce/base-utils';
import withScrollToTop from '@woocommerce/base-hocs/with-scroll-to-top';

/**
 * Internal dependencies
 */
import FullCart from './full-cart';

// Make it so we can read jQuery events triggered by WC Core elements.
translateJQueryEventToNative( 'added_to_cart', 'wc-blocks_added_to_cart' );

const Block = ( { emptyCart, attributes, scrollToTop } ) => {
	const { cartItems, cartIsLoading } = useStoreCart();

	useEffect( () => {
		const invalidateCartData = () => {
			if ( cartItems.length === 0 ) {
				dispatch( storeKey ).invalidateResolutionForStore();
				scrollToTop();
			}
		};

		document.body.addEventListener(
			'wc-blocks_added_to_cart',
			invalidateCartData
		);

		// returned function will be called on component unmount
		return () => {
			document.body.removeEventListener(
				'wc-blocks_added_to_cart',
				invalidateCartData
			);
		};
	}, [ cartItems.length ] );

	return (
		<>
			{ ! cartIsLoading && cartItems.length === 0 ? (
				<RawHTML>{ emptyCart }</RawHTML>
			) : (
				<LoadingMask showSpinner={ true } isLoading={ cartIsLoading }>
					<ValidationContextProvider>
						<CartProvider>
							<FullCart attributes={ attributes } />
						</CartProvider>
					</ValidationContextProvider>
				</LoadingMask>
			) }
		</>
	);
};

export default withScrollToTop( Block );
