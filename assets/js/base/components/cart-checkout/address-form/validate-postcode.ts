/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

const isGbPostcode = ( postcode: string ): boolean => {
	// Permitted letters depend upon their position in the postcode.
	// https://en.wikipedia.org/wiki/Postcodes_in_the_United_Kingdom#Validation.
	const alpha1 = '[abcdefghijklmnoprstuwyz]'; // Character 1.
	const alpha2 = '[abcdefghklmnopqrstuvwxy]'; // Character 2.
	const alpha3 = '[abcdefghjkpstuw]'; // Character 3 == ABCDEFGHJKPSTUW.
	const alpha4 = '[abehmnprvwxy]'; // Character 4 == ABEHMNPRVWXY.
	const alpha5 = '[abdefghjlnpqrstuwxyz]'; // Character 5 != CIKMOV.

	const pcexp = [];

	// Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA.
	pcexp[ 0 ] = new RegExp(
		`^(${ alpha1 }${ alpha2 }{0,1}[0-9]{1,2})([0-9]{1}${ alpha5 }{2})$`,
		'i'
	);

	// Expression for postcodes: ANA NAA.
	pcexp[ 1 ] = new RegExp(
		`^(${ alpha1 }{1}[0-9]{1}${ alpha3 }{1})([0-9]{1}${ alpha5 }{2})$`,
		'i'
	);

	// Expression for postcodes: AANA NAA.
	pcexp[ 2 ] = new RegExp(
		`^(${ alpha1 }{1}${ alpha2 }[0-9]{1}${ alpha4 })([0-9]{1}${ alpha5 }{2})$`,
		'i'
	);

	// Exception for the special postcode GIR 0AA.
	pcexp[ 3 ] = /^(gir)(0aa)$/i;

	// Standard BFPO numbers.
	pcexp[ 4 ] = /^(bfpo)([0-9]{1,4})$/;

	// c/o BFPO numbers.
	pcexp[ 5 ] = /^(bfpo)(c\/o[0-9]{1,3})$/;

	// Load up the string to check, converting into lowercase and removing spaces.
	postcode = postcode.toLowerCase();
	postcode = postcode.replace( /\s/g, '' );

	// Check the string against the six types of postcodes.
	return pcexp.some( ( expression ) => {
		return !! postcode.match( expression )?.length;
	} );
};

export const normalizePostcode = ( postcode: string ): string => {
	return postcode
		.replace( /[\s\-]/g, '' )
		.trim()
		.toUpperCase();
};

export const isPostcode = ( postcode: string, country: string ): boolean => {
	if (
		typeof postcode !== 'string' ||
		postcode.replace( /[\s\-A-Za-z0-9]/g, '' ).trim().length !== 0
	) {
		return false;
	}

	let valid;

	switch ( country ) {
		case 'AT':
			valid = !! postcode.match( /^([0-9]{4})$/ )?.length;
			break;
		case 'BA':
			valid = !! postcode.match( /^([7-8])([0-9]{4})$/ )?.length;
			break;
		case 'BE':
			valid = !! postcode.match( /^([0-9]{4})$/ )?.length;
			break;
		case 'BR':
			valid = !! postcode.match( /^([0-9]{5})([-])?([0-9]{3})$/ )?.length;
			break;
		case 'CH':
			valid = !! postcode.match( /^([0-9]{4})$/ )?.length;
			break;
		case 'DE':
			valid = !! postcode.match( /^([0][1-9]|[1-9][0-9])[0-9]{3}$/ )
				?.length;
			break;
		case 'ES':
		case 'FR':
		case 'IT':
			valid = !! postcode.match( /^([0-9]{5})$/ )?.length;
			break;
		case 'GB':
			valid = isGbPostcode( postcode );
			break;
		case 'HU':
			valid = !! postcode.match( /^([0-9]{4})$/ )?.length;
			break;
		case 'IE':
			valid = !! normalizePostcode( postcode ).match(
				/([AC-FHKNPRTV-Y]\d{2}|D6W)[0-9AC-FHKNPRTV-Y]{4}/i
			)?.length;
			break;
		case 'IN':
			valid = !! postcode.match( /^[1-9][0-9]{2}\s?[0-9]{3}$/ )?.length;
			break;
		case 'JP':
			valid = !! postcode.match( /^([0-9]{3})([-]?)([0-9]{4})$/ )?.length;
			break;
		case 'PT':
			valid = !! postcode.match( /^([0-9]{4})([-])([0-9]{3})$/ )?.length;
			break;
		case 'PR':
		case 'US':
			valid = !! postcode.match( /^([0-9]{5})(-[0-9]{4})?$/ )?.length;
			break;
		case 'CA':
			// CA Postal codes cannot contain D,F,I,O,Q,U and cannot start with W or Z. https://en.wikipedia.org/wiki/Postal_codes_in_Canada#Number_of_possible_postal_codes.
			valid = !! postcode.match(
				/^([ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ])([ ])?(\d[ABCEGHJKLMNPRSTVWXYZ]\d)$/i
			)?.length;
			break;
		case 'PL':
			valid = !! postcode.match( /^([0-9]{2})([-])([0-9]{3})$/ )?.length;
			break;
		case 'CZ':
		case 'SK':
			valid = !! postcode.match( /^([0-9]{3})(s?)([0-9]{2})$/ )?.length;
			break;
		case 'NL':
			valid = !! postcode.match(
				/^([1-9][0-9]{3})(\s?)(?!SA|SD|SS)[A-Z]{2}$/i
			)?.length;
			break;
		case 'SI':
			valid = !! postcode.match( /^([1-9][0-9]{3})$/ )?.length;
			break;
		case 'LI':
			valid = !! postcode.match( /^(94[8-9][0-9])$/ )?.length;
			break;
		default:
			valid = false;
			break;
	}
	return valid;
};

export const validatePostcode = (
	postcode: string,
	country: string,
	setValidationErrors: ( newErrors: Record< string, unknown > ) => void,
	clearValidationError: ( error: string ) => void,
	type: 'billing' | 'shipping'
) => {
	if ( ! isPostcode( postcode, country ) && postcode.length > 0 ) {
		setValidationErrors( {
			[ `${ type }-postcode` ]: {
				message: __( 'Please enter a valid postcode.', 'woocommerce' ),
				hidden: false,
			},
		} );
		return;
	}
	clearValidationError( 'postcode' );
};
