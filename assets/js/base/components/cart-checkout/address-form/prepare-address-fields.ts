/** @typedef { import('@woocommerce/type-defs/address-fields').CountryAddressFields } CountryAddressFields */

/**
 * External dependencies
 */
import {
	defaultAddressFields,
	getSetting,
	AddressField,
	AddressFields,
	KeyedAddressField,
} from '@woocommerce/settings';
import { __, sprintf } from '@wordpress/i18n';

type CoreLocaleSettings = Record<
	string,
	Record< keyof AddressFields, AddressField >
>;
/**
 * This is locale data from WooCommerce countries class. This doesn't match the shape of the new field data blocks uses,
 * but we can import part of it to set which fields are required.
 *
 * This supports new properties such as optionalLabel which are not used by core (yet).
 */
const coreLocale: CoreLocaleSettings = getSetting(
	'countryLocale',
	{}
) as CoreLocaleSettings;

/**
 * Gets props from the core locale, then maps them to the shape we require in the client.
 *
 * Ignores "class", "type", "placeholder", and "autocomplete" props from core.
 *
 * @param {Object} localeField Locale fields from WooCommerce.
 * @return {Object} Supported locale fields.
 */
const getSupportedCoreLocaleProps = ( localeField: AddressField ) => {
	const fields: Partial< AddressField > = {};

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
			/* translators: %s Field label. */
			__( '%s (optional)', 'woo-gutenberg-products-block' ),
			localeField.label
		);
	}

	if ( localeField.priority ) {
		if ( typeof localeField.priority === 'string' ) {
			fields.index = parseInt( localeField.priority, 10 );
		}
		if ( typeof localeField.priority === 'number' ) {
			fields.index = localeField.priority;
		}
	}

	if ( localeField.hidden === true ) {
		fields.required = false;
	}

	return fields;
};

const countryAddressFields = Object.entries( coreLocale )
	.map( ( [ country, countryLocale ] ) => [
		country,
		Object.entries( countryLocale )
			.map( ( [ localeFieldKey, localeField ] ) => {
				return [
					localeFieldKey,
					getSupportedCoreLocaleProps( localeField ),
				] as [ keyof AddressField, AddressField ];
			} )
			.reduce( ( obj, [ key, val ] ) => {
				obj[ key ] = val;
				return obj;
			}, Object.assign( {} ) ),
	] )
	.reduce( ( obj, [ key, val ] ) => {
		obj[ key ] = val;
		return obj;
	}, Object.assign( {} ) );

/**
 * Combines address fields, including fields from the locale, and sorts them by index.
 *
 * @param {Array} fields List of field keys--only address fields matching these will be returned.
 * @param {Object} fieldConfigs Fields config contains field specific overrides at block level which may, for example, hide a field.
 * @param {string} addressCountry Address country code. If unknown, locale fields will not be merged.
 */
const prepareAddressFields = (
	fields: ( keyof AddressFields )[] | undefined,
	fieldConfigs: Record< keyof AddressFields, Partial< AddressField > >,
	addressCountry = ''
): KeyedAddressField[] => {
	const localeConfigs =
		addressCountry && countryAddressFields[ addressCountry ] !== undefined
			? countryAddressFields[ addressCountry ]
			: {};

	if ( fields === undefined ) {
		return [];
	}

	return fields
		.map( ( field ) => {
			const defaultConfig =
				defaultAddressFields[ field ] || Object.assign( {} );
			const localeConfig = localeConfigs[ field ] || Object.assign( {} );
			const fieldConfig = fieldConfigs[ field ] || Object.assign( {} );

			return {
				key: field,
				...defaultConfig,
				...localeConfig,
				...fieldConfig,
			};
		} )
		.sort( ( a, b ) => a.index - b.index );
};

export default prepareAddressFields;
