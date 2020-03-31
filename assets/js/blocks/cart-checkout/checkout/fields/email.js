/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ValidatedTextInput } from '@woocommerce/base-components/text-input';
import { useBillingDataContext } from '@woocommerce/base-context';

const EmailField = () => {
	const { billingData, setBillingData } = useBillingDataContext();

	return (
		<ValidatedTextInput
			type="email"
			label={ __( 'Email address', 'woo-gutenberg-products-block' ) }
			value={ billingData.email }
			autoComplete="email"
			onChange={ ( newValue ) => setBillingData( { email: newValue } ) }
			required={ true }
		/>
	);
};

export default EmailField;
