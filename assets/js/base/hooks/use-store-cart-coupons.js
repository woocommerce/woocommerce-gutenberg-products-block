/** @typedef { import('@woocommerce/type-defs/hooks').StoreCartCoupon } StoreCartCoupon */

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { CART_STORE_KEY as storeKey } from '@woocommerce/block-data';
import { useStoreNotices } from '@woocommerce/base-hooks';

/**
 * Internal dependencies
 */
import { useStoreCart } from './use-store-cart';

/**
 * This is a custom hook for loading the Store API /cart/coupons endpoint and an
 * action for adding a coupon _to_ the cart.
 * See also: https://github.com/woocommerce/woocommerce-gutenberg-products-block/tree/master/src/RestApi/StoreApi
 *
 * @return {StoreCartCoupon} An object exposing data and actions from/for the
 * store api /cart/coupons endpoint.
 */
export const useStoreCartCoupons = () => {
	const { cartCoupons, cartErrors, cartIsLoading } = useStoreCart();
	const {
		addErrorNotice,
		addSuccessNotice,
		addInfoNotice,
	} = useStoreNotices();

	const results = useSelect(
		( select, { dispatch } ) => {
			const store = select( storeKey );
			const isApplyingCoupon = store.isApplyingCoupon();
			const isRemovingCoupon = store.isRemovingCoupon();
			const { applyCoupon, removeCoupon } = dispatch( storeKey );

			const applyCouponWithNotices = ( couponCode ) => {
				applyCoupon( couponCode )
					.then( ( result ) => {
						if ( result === true ) {
							addSuccessNotice(
								sprintf(
									// translators: %s coupon code.
									__(
										'Coupon code "%s" has been applied to your cart',
										'woo-gutenberg-products-block'
									),
									couponCode
								),
								{
									id: 'coupon-form',
								}
							);
						}
					} )
					.catch( ( error ) => {
						addErrorNotice( error.message, {
							id: 'coupon-form',
						} );
					} );
			};

			const removeCouponWithNotices = ( couponCode ) => {
				removeCoupon( couponCode )
					.then( ( result ) => {
						if ( result === true ) {
							addInfoNotice(
								sprintf(
									// translators: %s coupon code.
									__(
										'Coupon code "%s" has been removed from your cart',
										'woo-gutenberg-products-block'
									),
									couponCode
								),
								{
									id: 'coupon-form',
								}
							);
						}
					} )
					.catch( ( error ) => {
						addErrorNotice( error.message, {
							id: 'coupon-form',
						} );
					} );
			};

			return {
				applyCoupon: applyCouponWithNotices,
				removeCoupon: removeCouponWithNotices,
				isApplyingCoupon,
				isRemovingCoupon,
			};
		},
		[ addErrorNotice, addSuccessNotice, addInfoNotice ]
	);

	return {
		appliedCoupons: cartCoupons,
		cartCouponsErrors: cartErrors,
		isLoading: cartIsLoading,
		...results,
	};
};
