/**
 * Internal dependencies
 */
import { isPostcode, normalizePostcode } from '../validate-postcode';

describe( 'Postcode validation functions', () => {
	it( 'normalizePostcode returns a postcode with no spaces, all in uppercase, and no trailing/leading whitespace', () => {
		const allAssertions = [
			[ 'L10BP', normalizePostcode( ' l1   0b p   ' ) ],
			[ '90210', normalizePostcode( '90210' ) ],
			[ '90210', normalizePostcode( '90210  ' ) ],
			[ '90210', normalizePostcode( '  90210  ' ) ],
			[ 'AAAAAAAAAAAA', normalizePostcode( 'AAA A AAA AAA AA' ) ],
		];

		expect(
			allAssertions.every(
				( [ expected, actual ] ) => actual === expected
			)
		).toBe( true );
	} );

	it( 'isPostcode returns true when a postcode is valid, false when it is not', () => {
		const it = [
			[ true, isPostcode( '99999', 'IT' ) ],
			[ false, isPostcode( '9999', 'IT' ) ],
			[ false, isPostcode( 'ABC 999', 'IT' ) ],
			[ false, isPostcode( 'ABC-999', 'IT' ) ],
			[ false, isPostcode( 'ABC_123', 'IT' ) ],
		];

		const gb = [
			[ true, isPostcode( 'A9 9AA', 'GB' ) ],
			[ true, isPostcode( 'GIR 0AA', 'GB' ) ],
			[ false, isPostcode( 'GIRO 0AA', 'GB' ) ],
			[ false, isPostcode( '99999', 'GB' ) ],
		];

		const us = [
			[ true, isPostcode( '99999', 'US' ) ],
			[ true, isPostcode( '99999-9999', 'US' ) ],
			[ false, isPostcode( 'ABCDE', 'US' ) ],
			[ false, isPostcode( 'ABCDE-9999', 'US' ) ],
		];

		const ch = [
			[ true, isPostcode( '9999', 'CH' ) ],
			[ false, isPostcode( '99999', 'CH' ) ],
			[ false, isPostcode( 'ABCDE', 'CH' ) ],
		];

		const br = [
			[ true, isPostcode( '99999-999', 'BR' ) ],
			[ true, isPostcode( '99999999', 'BR' ) ],
			[ false, isPostcode( '99999 999', 'BR' ) ],
			[ false, isPostcode( '99999-ABC', 'BR' ) ],
		];

		const ca = [
			[ true, isPostcode( 'A9A 9A9', 'CA' ) ],
			[ true, isPostcode( 'A9A9A9', 'CA' ) ],
			[ true, isPostcode( 'a9a9a9', 'CA' ) ],
			[ false, isPostcode( 'D0A 9A9', 'CA' ) ],
			[ false, isPostcode( '99999', 'CA' ) ],
			[ false, isPostcode( 'ABC999', 'CA' ) ],
			[ false, isPostcode( '0A0A0A', 'CA' ) ],
		];

		const nl = [
			[ true, isPostcode( '3852GC', 'NL' ) ],
			[ true, isPostcode( '3852 GC', 'NL' ) ],
			[ true, isPostcode( '3852 gc', 'NL' ) ],
			[ false, isPostcode( '3852SA', 'NL' ) ],
			[ false, isPostcode( '3852 SA', 'NL' ) ],
			[ false, isPostcode( '3852 sa', 'NL' ) ],
		];

		const si = [
			[ true, isPostcode( '1234', 'SI' ) ],
			[ true, isPostcode( '1000', 'SI' ) ],
			[ true, isPostcode( '9876', 'SI' ) ],
			[ false, isPostcode( '12345', 'SI' ) ],
			[ false, isPostcode( '0123', 'SI' ) ],
		];

		const ba = [
			[ true, isPostcode( '71000', 'BA' ) ],
			[ true, isPostcode( '78256', 'BA' ) ],
			[ true, isPostcode( '89240', 'BA' ) ],
			[ false, isPostcode( '61000', 'BA' ) ],
			[ false, isPostcode( '7850', 'BA' ) ],
		];

		const jp = [
			[ true, isPostcode( '1340088', 'JP' ) ],
			[ true, isPostcode( '134-0088', 'JP' ) ],
			[ false, isPostcode( '1340-088', 'JP' ) ],
			[ false, isPostcode( '12345', 'JP' ) ],
			[ false, isPostcode( '0123', 'JP' ) ],
		];

		const allAssertions = [ it, gb, us, ch, br, ca, nl, si, ba, jp ].reduce(
			( a, b ) => a.concat( b ),
			[]
		);

		expect(
			allAssertions.every(
				( [ expected, actual ] ) => actual === expected
			)
		).toBe( true );
	} );
} );
