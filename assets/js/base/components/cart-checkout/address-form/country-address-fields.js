/** @typedef { import('@woocommerce/type-defs/address-fields').CountryAddressFields } CountryAddressFields */
/** @typedef { import('@woocommerce/type-defs/address-fields').AddressFieldKey } AddressFieldKey */
/** @typedef { import('@woocommerce/type-defs/address-fields').AddressField } AddressField */

/**
 * External dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { getSetting } from '@woocommerce/settings';

/**
 * This is locale data from WooCommerce countries class. This doesn't match the shape of the new field data blocks uses,
 * but we can import part of it to set which fields are required.
 *
 * This supports new properties such as optionalLabel which are not used by core (yet).
 */
const coreLocale = getSetting( 'countryLocale', {} );

/**
 * Get supported props from the core locale and map to the correct format.
 *
 * Notes:
 * 	Ignores "class", "type", "placeholder", and "autocomplete"--blocks handles these visual elements.
 * 	Core "priority" goes up in increments of 10, but blocks expects 1, 2, 3 etc.
 *
 * @param {Object} localeField Locale fields from WooCommerce.
 * @return {Object} Supported locale fields.
 */
const getSupportedProps = ( localeField ) => {
	const fields = {};

	if ( localeField.label !== undefined ) {
		fields.label = localeField.label;
	}

	if ( localeField.required !== undefined ) {
		fields.required = localeField.required;
	}

	if ( localeField.hidden !== undefined ) {
		fields.hidden = localeField.hidden;
	}

	if ( localeField.label !== undefined && ! localeField.optionalLabel ) {
		fields.optionalLabel = sprintf(
			/* Translators: %s Field label. */
			__( '%s (optional)', 'woo-gutenberg-products-block' ),
			localeField.label
		);
	}

	if ( localeField.priority ) {
		fields.index = parseInt( localeField.priority, 10 ) / 10;
	}

	if ( localeField.hidden === true ) {
		fields.required = false;
	}

	return fields;
};

const coreAddressFieldConfig = Object.fromEntries(
	Object.entries( coreLocale ).map( ( [ country, countryLocale ] ) => [
		country,
		Object.fromEntries(
			Object.entries(
				countryLocale
			).map( ( [ localeFieldKey, localeField ] ) => [
				localeFieldKey,
				getSupportedProps( localeField ),
			] )
		),
	] )
);

export default coreAddressFieldConfig;
