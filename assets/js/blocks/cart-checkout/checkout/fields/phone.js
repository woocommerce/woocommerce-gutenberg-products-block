/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ValidatedTextInput } from '@woocommerce/base-components/text-input';
import { useBillingDataContext } from '@woocommerce/base-context';

const PhoneField = ( { required = false } ) => {
	const { billingData, setBillingData } = useBillingDataContext();

	return (
		<ValidatedTextInput
			type="tel"
			label={
				required
					? __( 'Phone', 'woo-gutenberg-products-block' )
					: __( 'Phone (optional)', 'woo-gutenberg-products-block' )
			}
			value={ billingData.phone }
			autoComplete="tel"
			onChange={ ( newValue ) =>
				setBillingData( {
					phone: newValue,
				} )
			}
			required={ required }
		/>
	);
};

export default PhoneField;
