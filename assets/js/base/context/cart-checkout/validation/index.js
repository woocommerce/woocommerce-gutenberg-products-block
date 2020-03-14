/**
 * External dependencies
 */
import { createContext, useContext, useState } from '@wordpress/element';
import { omit, pickBy } from 'lodash';

/**
 * @typedef { import('@woocommerce/type-defs/contexts').ValidationContext } ValidationContext
 */

const ValidationContext = createContext( {
	getValidationError: () => '',
	setValidationErrors: ( errors ) => void errors,
	clearValidationError: ( property ) => void property,
	clearAllValidationErrors: () => void null,
} );

/**
 * @return {ValidationContext} The context values for the validation context.
 */
export const useValidationContext = () => {
	return useContext( ValidationContext );
};

/**
 * Validation context provider
 *
 * Any children of this context will be exposed to validation state and helpers
 * for tracking validation.
 */
export const ValidationContextProvider = ( { children } ) => {
	const [ validationErrors, updateValidationErrors ] = useState( {} );

	/**
	 * This retrieves any validation error message that exists in state for the
	 * given property name.
	 *
	 * @param {string} property The property the error message is for.
	 *
	 * @return {string} Either the error message for the given property or an
	 *                  empty string.
	 */
	const getValidationError = ( property ) =>
		validationErrors[ property ] || '';

	/**
	 * Clears any validation error that exists in state for the given property
	 * name.
	 *
	 * @param {string} property  The name of the property to clear if exists in
	 *                           validation error state.
	 */
	const clearValidationError = ( property ) => {
		if ( validationErrors[ property ] ) {
			updateValidationErrors( omit( validationErrors, [ property ] ) );
		}
	};

	/**
	 * Clears the entire validation error state.
	 */
	const clearAllValidationErrors = () => void updateValidationErrors( {} );

	/**
	 * Used to record new validation errors in the state.
	 *
	 * @param {Object} newErrors An object where keys are the property names the
	 *                           validation error is for and values are the
	 *                           validation error message displayed to the user.
	 */
	const setValidationErrors = ( newErrors ) => {
		// all values must be a string.
		newErrors = pickBy(
			newErrors,
			( message ) => typeof message === 'string'
		);
		if ( Object.values( newErrors ).length > 0 ) {
			updateValidationErrors( { ...validationErrors, ...newErrors } );
		}
	};
	const context = {
		getValidationError,
		setValidationErrors,
		clearValidationError,
		clearAllValidationErrors,
	};
	return (
		<ValidationContext.Provider value={ context }>
			{ children }
		</ValidationContext.Provider>
	);
};
