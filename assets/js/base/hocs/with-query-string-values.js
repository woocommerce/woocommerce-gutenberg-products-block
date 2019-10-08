import { Component } from 'react';
import { addQueryArgs, getQueryArg } from '@wordpress/url';

/**
 * HOC that keeps the state in sync with the URL query string.
 */
const withQueryStringValues = ( values ) => ( OriginalComponent ) => {
	let instances = 0;

	class WrappedComponent extends Component {
		urlParameterSuffix = instances++ > 0 ? `_${ instances }` : '';

		hasWindowDependencies =
			typeof window === 'object' &&
			window.hasOwnProperty( 'history' ) &&
			window.hasOwnProperty( 'location' ) &&
			typeof window.addEventListener === 'function' &&
			typeof window.removeEventListener === 'function';

		getStateFromLocation = () => {
			const state = {};

			if ( this.hasWindowDependencies ) {
				values.forEach( ( value ) => {
					state[ value ] = getQueryArg(
						window.location.href,
						value + this.urlParameterSuffix
					);
				} );
			}

			return state;
		};

		state = this.getStateFromLocation();

		componentDidMount = () => {
			if ( this.hasWindowDependencies ) {
				window.addEventListener(
					'popstate',
					this.updateStateFromLocation
				);
			}
		};

		componentWillUnmount = () => {
			if ( this.hasWindowDependencies ) {
				window.removeEventListener(
					'popstate',
					this.updateStateFromLocation
				);
			}
		};

		updateStateFromLocation = () => {
			this.setState( this.getStateFromLocation() );
		};

		updateQueryStringValues = ( newValues ) => {
			this.setState( newValues );

			if ( this.hasWindowDependencies ) {
				const queryStringValues = {};
				Object.keys( newValues ).forEach( ( key ) => {
					queryStringValues[ key + this.urlParameterSuffix ] =
						newValues[ key ];
				} );

				window.history.pushState(
					null,
					'',
					addQueryArgs( window.location.href, queryStringValues )
				);
			}
		};

		render() {
			return (
				<OriginalComponent
					{ ...this.props }
					{ ...this.state }
					updateQueryStringValues={ this.updateQueryStringValues }
				/>
			);
		}
	}

	WrappedComponent.displayName = 'withQueryStringValues';
	return WrappedComponent;
};

export default withQueryStringValues;
