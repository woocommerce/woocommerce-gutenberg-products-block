/**
 * External dependencies
 */
import Form from '@woocommerce/base-components/form';
import { useCheckoutContext } from '@woocommerce/base-context';
import PropTypes from 'prop-types';
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './style.scss';

const CheckoutForm = ( {
	requireCompanyField,
	requirePhoneField,
	showApartmentField,
	showCompanyField,
	showOrderNotes,
	showPhoneField,
	allowCreateAccount,
} ) => {
	const { onSubmit } = useCheckoutContext();
	const TEMPLATE = [
		[
			'woocommerce/address-step',
			{
				requireCompanyField,
				requirePhoneField,
				showApartmentField,
				showCompanyField,
				showPhoneField,
				allowCreateAccount,
			},
		],
		[ 'woocommerce/shipping-step', {} ],
	];
	return (
		<Form className="wc-block-checkout__form" onSubmit={ onSubmit }>
			<InnerBlocks
				templateLock="insert"
				renderAppender={ false }
				template={ TEMPLATE }
			/>
		</Form>
	);
};

CheckoutForm.propTypes = {
	requireCompanyField: PropTypes.bool.isRequired,
	requirePhoneField: PropTypes.bool.isRequired,
	showApartmentField: PropTypes.bool.isRequired,
	showCompanyField: PropTypes.bool.isRequired,
	showOrderNotes: PropTypes.bool.isRequired,
	showPhoneField: PropTypes.bool.isRequired,
};

export default CheckoutForm;

/*
<ShippingOptionsStep />
<PaymentMethodStep />
<OrderNotesStep showOrderNotes={ showOrderNotes } />

[ 'woocommerce/payment-step', {} ],
[ 'woocommerce/order-not-step', { showOrderNotes } ],
*/
