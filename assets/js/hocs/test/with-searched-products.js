/**
 * External dependencies
 */
import TestRenderer from 'react-test-renderer';
import _ from 'lodash';

/**
 * Internal dependencies
 */
import withSearchedProducts from '../with-searched-products';
import * as mockedUtils from '../../components/utils';

// Mock the getProducts and isLargeCatalog values for tests.
mockedUtils.getProducts = jest.fn().mockImplementation(
	( { selected } ) => Promise.resolve( selected )
);
mockedUtils.isLargeCatalog = true;

// Add a mock implementation of debounce for testing so we can spy on
// the onSearch call.
const debouncedCancel = jest.fn();
const debouncedAction = jest.fn();
_.debounce = ( onSearch ) => {
	const debounced = debouncedAction.mockImplementation(
		() => {
			onSearch();
		}
	);
	debounced.cancel = debouncedCancel;
	return debounced;
};

describe( 'withSearchedProducts Component', () => {
	const { getProducts } = mockedUtils;
	afterEach( () => {
		debouncedCancel.mockClear();
		debouncedAction.mockClear();
		mockedUtils.getProducts.mockClear();
		mockedUtils.isLargeCatalog = false;
	} );
	const TestComponent = withSearchedProducts( ( {
		selected,
		products,
		isLoading,
		onSearch,
	} ) => {
		return <div
			products={ products }
			selected={ selected }
			isLoading={ isLoading }
			onSearch={ onSearch }
		/>;
	} );
	describe( 'lifecycle tests', () => {
		const selected = [ { id: 10, name: 'foo' } ];
		const renderer = TestRenderer.create(
			<TestComponent
				selected={ selected }
			/>
		);
		let props;
		it( 'getProducts is called on mount with passed in selected ' +
			'values', () => {
			expect( getProducts ).toHaveBeenCalledWith( { selected } );
			expect( getProducts ).toHaveBeenCalledTimes( 1 );
		} );
		it( 'has expected values for props', () => {
			props = renderer.root.findByType( 'div' ).props;
			expect( props.selected ).toEqual( selected );
			expect( props.products ).toEqual( selected );
		} );
		it( 'debounce and getProducts is called on search event', () => {
			props.onSearch();
			expect( debouncedAction ).toHaveBeenCalled();
			expect( getProducts ).toHaveBeenCalledTimes( 1 );
		} );
		it( 'debounce is cancelled on unmount', () => {
			renderer.unmount();
			expect( debouncedCancel ).toHaveBeenCalled();
			expect( getProducts ).toHaveBeenCalledTimes( 0 );
		} );
	} );
} );
