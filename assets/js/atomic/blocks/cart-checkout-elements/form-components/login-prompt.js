/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	CHECKOUT_SHOW_LOGIN_REMINDER,
	LOGIN_URL,
} from '@woocommerce/block-settings';
import { useCheckoutContext } from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */

const LOGIN_TO_CHECKOUT_URL = `${ LOGIN_URL }?redirect_to=${ encodeURIComponent(
	window.location.href
) }`;

const LoginPrompt = () => {
	const { customerId } = useCheckoutContext();

	if ( ! CHECKOUT_SHOW_LOGIN_REMINDER || customerId ) {
		return null;
	}

	return (
		<>
			{ __(
				'Already have an account? ',
				'woo-gutenberg-products-block'
			) }
			<a href={ LOGIN_TO_CHECKOUT_URL }>
				{ __( 'Log in.', 'woo-gutenberg-products-block' ) }
			</a>
		</>
	);
};

export default LoginPrompt;
