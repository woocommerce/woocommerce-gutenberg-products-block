/**
 * External dependencies
 */
import TestRenderer, { act } from 'react-test-renderer';

/**
 * Internal dependencies
 */
import { usePrevious } from '../use-previous';

describe( 'usePrevious', () => {
	const TestComponent = ( { testValue } ) => {
		const previousValue = usePrevious( testValue );
		return <div testValue={ testValue } previousValue={ previousValue } />;
	};

	let renderer;
	beforeEach( () => ( renderer = null ) );

	it( 'should be undefined at first pass', () => {
		act( () => {
			renderer = TestRenderer.create( <TestComponent testValue={ 1 } /> );
		} );
		const testValue = renderer.root.findByType( 'div' ).props.testValue;
		const testPreviousValue = renderer.root.findByType( 'div' ).props
			.previousValue;

		expect( testValue ).toBe( 1 );
		expect( testPreviousValue ).toBe( undefined );
	} );

	it( 'test new and previous value', () => {
		let testValue;
		let testPreviousValue;
		act( () => {
			renderer = TestRenderer.create( <TestComponent testValue={ 1 } /> );
		} );

		act( () => {
			renderer.update( <TestComponent testValue={ 2 } /> );
		} );
		testValue = renderer.root.findByType( 'div' ).props.testValue;
		testPreviousValue = renderer.root.findByType( 'div' ).props
			.previousValue;
		expect( testValue ).toBe( 2 );
		expect( testPreviousValue ).toBe( 1 );

		act( () => {
			renderer.update( <TestComponent testValue={ 3 } /> );
		} );
		testValue = renderer.root.findByType( 'div' ).props.testValue;
		testPreviousValue = renderer.root.findByType( 'div' ).props
			.previousValue;
		expect( testValue ).toBe( 3 );
		expect( testPreviousValue ).toBe( 2 );
	} );
} );
