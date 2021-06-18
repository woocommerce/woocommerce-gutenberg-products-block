/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { ComboboxControl } from 'wordpress-components';
import { withInstanceId } from '@woocommerce/base-hocs/with-instance-id';
import {
	ValidationInputError,
	useValidationContext,
} from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
import './style.scss';

export interface ComboboxControlOption {
	label: string;
	value: string;
}

/**
 * Wrapper for the WordPress ComboboxControl which supports validation.
 */
const Combobox = ( {
	id,
	className,
	label,
	onChange,
	options,
	value,
	required = false,
	errorMessage = __(
		'Please select a value.',
		'woo-gutenberg-products-block'
	),
	errorId: incomingErrorId,
	instanceId = '0',
	autoComplete = 'off',
}: {
	id: string;
	className: string;
	label: string;
	onChange: ( filterValue: string ) => void;
	options: ComboboxControlOption[];
	value: string;
	required: boolean;
	errorMessage: string;
	errorId: string;
	instanceId: string;
	autoComplete: string;
} ): JSX.Element => {
	const {
		getValidationError,
		setValidationErrors,
		clearValidationError,
	} = useValidationContext();

	const controlId = id || 'control-' + instanceId;
	const errorId = incomingErrorId || controlId;
	const error = ( getValidationError( errorId ) || {
		message: '',
		hidden: false,
	} ) as {
		message: string;
		hidden: boolean;
	};

	useEffect( () => {
		if ( ! required || value ) {
			clearValidationError( errorId );
		} else {
			setValidationErrors( {
				[ errorId ]: {
					message: errorMessage,
					hidden: true,
				},
			} );
		}
		return () => {
			clearValidationError( errorId );
		};
	}, [
		clearValidationError,
		value,
		errorId,
		errorMessage,
		required,
		setValidationErrors,
	] );

	// We need a way to track focus of the child ComboboxControl so we can style the label.
	const [ hasFocus, setHasFocus ] = useState( false );

	const handleBlur = ( e: React.SyntheticEvent< EventTarget > ): void => {
		const currentTarget = e.currentTarget as Element;

		if ( ! hasFocus ) {
			return;
		}

		// Check the newly focused element in the next tick of the event loop.
		setTimeout( () => {
			// Check if the new activeElement is a child of the original container
			if ( ! currentTarget.contains( global.document.activeElement ) ) {
				setHasFocus( false );
			}
		}, 0 );
	};

	return (
		<div
			id={ controlId }
			className={ classnames( 'wc-block-components-combobox', className, {
				'is-active': value,
				'has-error': error.message && ! error.hidden,
				'has-focus': hasFocus,
			} ) }
			onBlur={ handleBlur }
		>
			<ComboboxControl
				className={ 'wc-block-components-combobox-control' }
				label={ label }
				onChange={ onChange }
				onFilterValueChange={ ( filterValue: string ) => {
					if ( ! hasFocus ) {
						setHasFocus( true );
					}
					if ( filterValue.length ) {
						// If we have a value, this could be from browser autofill. Try to match.
						const normalizedFilterValue = filterValue.toLocaleUpperCase();
						const foundOption = options.find(
							( option ) =>
								option.label
									.toLocaleUpperCase()
									.startsWith( normalizedFilterValue ) ||
								option.value.toLocaleUpperCase() ===
									normalizedFilterValue
						);
						if ( foundOption ) {
							onChange( foundOption.value );
						}
					}
				} }
				options={ options }
				value={ value || '' }
				allowReset={ false }
				autoComplete={ autoComplete }
			/>
			<ValidationInputError propertyName={ errorId } />
		</div>
	);
};

export default withInstanceId( Combobox );
