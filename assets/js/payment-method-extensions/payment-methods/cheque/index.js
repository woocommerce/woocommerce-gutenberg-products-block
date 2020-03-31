/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAYMENT_METHOD_NAME } from './constants';

const EditPlaceHolder = () => <div>TODO: Edit preview soon...</div>;

const Content = ( props ) => {
	const { activePaymentMethod } = props;

	return activePaymentMethod === PAYMENT_METHOD_NAME ? (
		<div>
			{ __(
				'Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.',
				'woo-gutenberg-products-block'
			) }
		</div>
	) : null;
};

// This needs a generic/default that resolves true to save time.
const chequePromise = new Promise( ( resolve ) => {
	resolve( true );
} );

const offlineChequePaymentMethod = {
	id: PAYMENT_METHOD_NAME,
	label: (
		<strong>
			{ __( 'Check Payment', 'woo-gutenberg-products-block' ) }
		</strong>
	),
	content: <Content />,
	edit: <EditPlaceHolder />,
	canMakePayment: chequePromise,
	ariaLabel: __( 'Cheque payment method', 'woo-gutenberg-products-block' ),
};

export default offlineChequePaymentMethod;
