/**
 * External dependencies
 */
import { ValidatedTextInput } from '@woocommerce/base-components/text-input';
import { useValidationContext } from '@woocommerce/base-context';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { withInstanceId } from '@woocommerce/base-hocs/with-instance-id';
import { useShallowEqual } from '@woocommerce/base-hooks';
import {
	defaultAddressFields,
	EnteredAddress,
	AddressField,
	AddressFields,
} from '@woocommerce/settings';
import { __experimentalApplyValidationFunctionsForField } from '@woocommerce/base-components/cart-checkout/address-form/registry';
import {
	BillingStateInput,
	ShippingStateInput,
} from '@woocommerce/base-components/state-input';

/**
 * Internal dependencies
 */
import prepareAddressFields from './prepare-address-fields';
import { validatePostcode } from './validate-postcode';
import { BillingCountryInput, ShippingCountryInput } from '../../country-input';

// If it's the shipping address form and the user starts entering address
// values without having set the country first, show an error.
const validateShippingCountry = (
	values: EnteredAddress,
	setValidationErrors: ( errors: Record< string, unknown > ) => void,
	clearValidationError: ( error: string ) => void,
	hasValidationError: boolean
) => {
	if (
		! hasValidationError &&
		! values.country &&
		( values.city || values.state || values.postcode )
	) {
		setValidationErrors( {
			'shipping-missing-country': {
				message: __(
					'Please select a country to calculate rates.',
					'woo-gutenberg-products-block'
				),
				hidden: false,
			},
		} );
	}
	if ( hasValidationError && values.country ) {
		clearValidationError( 'shipping-missing-country' );
	}
};

/**
 * Checkout address form.
 *
 * @param {Object} props Incoming props for component.
 * @param {string} props.id Id for component.
 * @param {Array}  props.fields Array of fields in form.
 * @param {Object} props.fieldConfig Field configuration for fields in form.
 * @param {string} props.instanceId Unique id for form.
 * @param {function(any):any} props.onChange Function to all for an form onChange event.
 * @param {string} props.type Type of form.
 * @param {Object} props.values Values for fields.
 */
const AddressForm = ( {
	id,
	fields = Object.keys( defaultAddressFields ) as ( keyof AddressFields )[],
	fieldConfig = {} as Record< keyof AddressFields, Partial< AddressField > >,
	instanceId,
	onChange,
	type = 'shipping',
	values,
}: {
	id: string | number;
	fields: ( keyof AddressFields )[];
	fieldConfig: Record< keyof AddressFields, Partial< AddressField > >;
	instanceId: number;
	onChange: ( address: EnteredAddress ) => void;
	type: 'shipping' | 'billing';
	values: EnteredAddress;
} ) => {
	const {
		getValidationError,
		setValidationErrors,
		clearValidationError,
	} = useValidationContext();

	const currentFields = useShallowEqual( fields );

	const countryValidationError = ( getValidationError(
		'shipping-missing-country'
	) || {} ) as { message: string; hidden: boolean };

	const addressFormFields = useMemo( () => {
		return prepareAddressFields(
			currentFields,
			fieldConfig,
			values.country
		);
	}, [ currentFields, fieldConfig, values.country ] );

	useEffect( () => {
		if ( type === 'shipping' ) {
			validateShippingCountry(
				values,
				setValidationErrors,
				clearValidationError,
				!! (
					countryValidationError.message &&
					! countryValidationError.hidden
				)
			);
		}
	}, [
		values,
		countryValidationError.message,
		countryValidationError.hidden,
		setValidationErrors,
		clearValidationError,
		type,
	] );

	useEffect( () => {
		validatePostcode(
			values.postcode,
			values.country,
			setValidationErrors,
			clearValidationError,
			type
		);
	}, [
		values.postcode,
		values.country,
		setValidationErrors,
		clearValidationError,
	] );

	id = ( id || instanceId ).toString();

	return (
		<div id={ id } className="wc-block-components-address-form">
			{ addressFormFields.map( ( field ) => {
				if ( field.hidden ) {
					return null;
				}

				if ( field.key === 'country' ) {
					const Tag =
						type === 'shipping'
							? ShippingCountryInput
							: BillingCountryInput;
					return (
						<Tag
							key={ field.key }
							id={ `${ id }-${ field.key }` }
							label={
								field.required
									? field.label
									: field.optionalLabel
							}
							value={ values.country }
							autoComplete={ field.autocomplete }
							onChange={ ( newValue ) => {
								onChange( {
									...values,
									country: newValue,
									state: '',
									city: '',
									postcode: '',
								} );
							} }
							onBlur={ ( value ) => {
								clearValidationError(
									`${ id }-${ field.key }`
								);
								__experimentalApplyValidationFunctionsForField(
									value,
									field.key,
									values,
									type,
									`${ id }-${ field.key }`,
									setValidationErrors
								);
							} }
							errorId={
								type === 'shipping'
									? 'shipping-missing-country'
									: null
							}
							errorMessage={ field.errorMessage }
							required={ field.required }
						/>
					);
				}

				if ( field.key === 'state' ) {
					const Tag =
						type === 'shipping'
							? ShippingStateInput
							: BillingStateInput;
					return (
						<Tag
							key={ field.key }
							id={ `${ id }-${ field.key }` }
							country={ values.country }
							label={
								field.required
									? field.label
									: field.optionalLabel
							}
							value={ values.state }
							autoComplete={ field.autocomplete }
							onChange={ ( newValue ) =>
								onChange( {
									...values,
									state: newValue,
								} )
							}
							onBlur={ ( value ) => {
								clearValidationError(
									`${ id }-${ field.key }`
								);
								__experimentalApplyValidationFunctionsForField(
									value,
									field.key,
									values,
									type,
									`${ id }-${ field.key }`,
									setValidationErrors
								);
							} }
							errorMessage={ field.errorMessage }
							required={ field.required }
						/>
					);
				}

				let customValidationProps = {};
				if ( field.key === 'postcode' ) {
					customValidationProps = {
						customValidation: ( value: string ) =>
							validatePostcode(
								value,
								values.country,
								setValidationErrors,
								clearValidationError,
								type
							),
					};
				}

				return (
					<ValidatedTextInput
						key={ field.key }
						id={ `${ id }-${ field.key }` }
						className={ `wc-block-components-address-form__${ field.key }` }
						label={
							field.required ? field.label : field.optionalLabel
						}
						value={ values[ field.key ] }
						autoCapitalize={ field.autocapitalize }
						autoComplete={ field.autocomplete }
						onChange={ ( newValue: string ) =>
							onChange( {
								...values,
								[ field.key ]: newValue,
							} )
						}
						onBlur={ ( value: string ) => {
							clearValidationError( `${ id }-${ field.key }` );
							__experimentalApplyValidationFunctionsForField(
								value,
								field.key,
								values,
								type,
								`${ id }-${ field.key }`,
								setValidationErrors
							);
						} }
						errorMessage={ field.errorMessage }
						required={ field.required }
						{ ...customValidationProps }
					/>
				);
			} ) }
		</div>
	);
};

export default withInstanceId( AddressForm );
