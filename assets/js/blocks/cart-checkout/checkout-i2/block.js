/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { useEffect } from '@wordpress/element';
import { useStoreCart, useStoreNotices } from '@woocommerce/base-context/hooks';
import {
	CheckoutProvider,
	useCheckoutContext,
	useValidationContext,
	StoreNoticesProvider,
	ValidationContextProvider,
} from '@woocommerce/base-context';
import BlockErrorBoundary from '@woocommerce/base-components/block-error-boundary';
import { createInterpolateElement } from 'wordpress-element';
import { SidebarLayout } from '@woocommerce/base-components/sidebar-layout';
import {
	CURRENT_USER_IS_ADMIN,
	isWcVersion,
	getSetting,
} from '@woocommerce/settings';
import { LOGIN_URL } from '@woocommerce/block-settings';
import withScrollToTop from '@woocommerce/base-hocs/with-scroll-to-top';

/**
 * Internal dependencies
 */
import './style.scss';
import EmptyCart from './empty-cart';
import CheckoutOrderError from './checkout-order-error';

export const LOGIN_TO_CHECKOUT_URL = `${ LOGIN_URL }?redirect_to=${ encodeURIComponent(
	window.location.href
) }`;

const reloadPage = () => void window.location.reload( true );

const Block = ( { ...props } ) => {
	const { cartItems, cartIsLoading } = useStoreCart();
	return (
		<>
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
					<StoreNoticesProvider context="wc/checkout">
						<ValidationContextProvider>
							<CheckoutProvider>
								<Checkout { ...props } />
							</CheckoutProvider>
						</ValidationContextProvider>
					</StoreNoticesProvider>
				</BlockErrorBoundary>
			) }
		</>
	);
};

const Checkout = ( { attributes, scrollToTop, children } ) => {
	const {
		hasOrder,
		hasError: checkoutHasError,
		isIdle: checkoutIsIdle,
		customerId,
	} = useCheckoutContext();
	const {
		hasValidationErrors,
		showAllValidationErrors,
	} = useValidationContext();
	const { hasNoticesOfType } = useStoreNotices();

	const hasErrorsToDisplay =
		checkoutIsIdle &&
		checkoutHasError &&
		( hasValidationErrors || hasNoticesOfType( 'default' ) );

	// Checkout signup is feature gated to WooCommerce 4.7 and newer; uses updated my-account/lost-password screen from 4.7+ for setting initial password.
	const allowCreateAccount =
		attributes.allowCreateAccount && isWcVersion( '4.7.0', '>=' );

	useEffect( () => {
		if ( hasErrorsToDisplay ) {
			showAllValidationErrors();
			scrollToTop( { focusableSelector: 'input:invalid' } );
		}
	}, [ hasErrorsToDisplay, scrollToTop, showAllValidationErrors ] );

	if ( ! hasOrder ) {
		return <CheckoutOrderError />;
	}

	if (
		! customerId &&
		! getSetting( 'checkoutAllowsGuest', false ) &&
		! ( allowCreateAccount && getSetting( 'checkoutAllowsSignup', false ) )
	) {
		return (
			<>
				{ __(
					'You must be logged in to checkout. ',
					'woo-gutenberg-products-block'
				) }
				<a href={ LOGIN_TO_CHECKOUT_URL }>
					{ __(
						'Click here to log in.',
						'woo-gutenberg-products-block'
					) }
				</a>
			</>
		);
	}
	const checkoutClassName = classnames( 'wc-block-checkout', {
		'has-dark-controls': attributes.hasDarkControls,
	} );

	return (
		<SidebarLayout className={ checkoutClassName }>
			{ children }
		</SidebarLayout>
	);
};

export default withScrollToTop( Block );
