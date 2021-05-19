/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { ValidatedTextInput } from '@woocommerce/base-components/text-input';

interface PhoneNumberProps {
	isRequired?: boolean;
	value?: string;
	onChange: ( value: string ) => void;
	onBlur?: ( value: string ) => void;
}
/**
 * Renders a phone number input.
 */
const PhoneNumber = ( {
	isRequired = false,
	value = '',
	onChange,
	onBlur = () => {
		/* Do nothing */
	},
}: PhoneNumberProps ): JSX.Element => {
	return (
		<ValidatedTextInput
			id="phone"
			type="tel"
			autoComplete="tel"
			onBlur={ ( nextValue: string ) => onBlur( nextValue ) }
			required={ isRequired }
			label={
				isRequired
					? __( 'Phone', 'woo-gutenberg-products-block' )
					: __( 'Phone (optional)', 'woo-gutenberg-products-block' )
			}
			value={ value }
			onChange={ onChange }
		/>
	);
};

export default PhoneNumber;
