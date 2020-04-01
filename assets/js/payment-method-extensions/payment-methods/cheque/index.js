/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAYMENT_METHOD_NAME } from './constants';
import { defaultPromise } from '../../utils';

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

const offlineChequePaymentMethod = {
	id: PAYMENT_METHOD_NAME,
	label: (
		<strong>
			{ __( 'Check Payment', 'woo-gutenberg-products-block' ) }
		</strong>
	),
	content: <Content />,
	edit: <EditPlaceHolder />,
	canMakePayment: defaultPromise,
	ariaLabel: __( 'Cheque payment method', 'woo-gutenberg-products-block' ),
};

export default offlineChequePaymentMethod;
