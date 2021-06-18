/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
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
	autoComplete = 'off',
	required = false,
	errorMessage = __(
		'Please select a value.',
		'woo-gutenberg-products-block'
	),
	errorId: incomingErrorId,
	instanceId = '0',
}: {
	id: string;
	className: string;
	label: string;
	onChange: () => void;
	options: ComboboxControlOption[];
	value: string;
	autoComplete: string;
	required: boolean;
	errorMessage: string;
	errorId: string;
	instanceId: string;
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

	return (
		<div
			id={ controlId }
			className={ classnames( 'wc-block-components-combobox', className, {
				'is-active': value,
				'has-error': error.message && ! error.hidden,
			} ) }
		>
			<ComboboxControl
				className={ 'wc-block-components-combobox-control' }
				label={ label }
				onChange={ onChange }
				onFilterValueChange={ () => void null }
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
