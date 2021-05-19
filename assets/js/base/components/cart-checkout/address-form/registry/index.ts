/**
 * External dependencies
 */
import { AddressType, EnteredAddress } from '@woocommerce/settings';

type ValidationFunction = (
	value: string,
	formData: EnteredAddress,
	type: AddressType
) => boolean;

interface ValidationFunctionAndErrorMessage {
	validationFunction: ValidationFunction;
	errorMessage?: string;
}

let validationFunctions: Record<
	string,
	Record< string, ValidationFunctionAndErrorMessage >
> = {};
/**
 * Register a function to run to validate a field.
 */
export const __experimentalRegisterValidationFunctions = (
	namespace: string,
	filters: Record< string, ValidationFunctionAndErrorMessage >
): void => {
	validationFunctions = {
		...validationFunctions,
		[ namespace ]: filters,
	};
};

/**
 * Get the custom validation functions for a specific field.
 */
const getValidationFunctions = ( fieldName: keyof EnteredAddress ) => {
	const namespaces = Object.keys( validationFunctions );
	const filters = namespaces
		.map( ( namespace ) => validationFunctions[ namespace ][ fieldName ] )
		.filter( Boolean );
	return filters;
};

export const __experimentalApplyValidationFunctionsForField = (
	value: string,
	fieldName: keyof EnteredAddress,
	fields: EnteredAddress,
	type: AddressType,
	errorMessageId: string,
	/* eslint-disable @typescript-eslint/no-explicit-any */
	setValidationErrors: ( errors: any ) => any
) => {
	const functions = getValidationFunctions( fieldName );
	functions.forEach( ( { validationFunction, errorMessage } ) => {
		if ( ! validationFunction( value, fields, type ) ) {
			setValidationErrors( {
				[ errorMessageId ]: { message: errorMessage, hidden: false },
			} );
		}
	} );
};
