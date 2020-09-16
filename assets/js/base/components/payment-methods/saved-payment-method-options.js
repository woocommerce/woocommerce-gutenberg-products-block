/**
 * External dependencies
 */
import { useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import {
	useEditorContext,
	usePaymentMethodDataContext,
} from '@woocommerce/base-context';
import RadioControl from '@woocommerce/base-components/radio-control';
import { getPaymentMethods } from '@woocommerce/blocks-registry';

/**
 * @typedef {import('@woocommerce/type-defs/contexts').CustomerPaymentMethod} CustomerPaymentMethod
 * @typedef {import('@woocommerce/type-defs/contexts').PaymentStatusDispatch} PaymentStatusDispatch
 */

/**
 * Returns the option object for a cc or echeck saved payment method token.
 *
 * @param {CustomerPaymentMethod} savedPaymentMethod
 * @param {function(string):void} setActivePaymentMethod
 * @param {PaymentStatusDispatch} setPaymentStatus
 * @return {Object} An option objects to use for RadioControl.
 */
const getCcOrEcheckPaymentMethodOption = (
	{ method, expires, tokenId },
	setActivePaymentMethod,
	setPaymentStatus
) => {
	return {
		value: tokenId + '',
		label: sprintf(
			__(
				'%1$s ending in %2$s (expires %3$s)',
				'woo-gutenberg-product-blocks'
			),
			method.brand,
			method.last4,
			expires
		),
		name: `wc-saved-payment-method-token-${ tokenId }`,
		onChange: ( token ) => {
			const savedTokenKey = `wc-${ method.gateway }-payment-token`;
			setActivePaymentMethod( method.gateway );
			setPaymentStatus().success( {
				payment_method: method.gateway,
				[ savedTokenKey ]: token,
				isSavedToken: true,
			} );
		},
	};
};

/**
 * Returns the option object for any non specific saved payment method.
 *
 * @param {CustomerPaymentMethod} savedPaymentMethod
 * @param {function(string):void} setActivePaymentMethod
 * @param {PaymentStatusDispatch} setPaymentStatus
 *
 * @return {Object} An option objects to use for RadioControl.
 */
const getDefaultPaymentMethodOptions = (
	{ method, tokenId },
	setActivePaymentMethod,
	setPaymentStatus
) => {
	return {
		value: tokenId + '',
		label: sprintf(
			__( 'Saved token for %s', 'woo-gutenberg-products-block' ),
			method.gateway
		),
		name: `wc-saved-payment-method-token-${ tokenId }`,
		onChange: ( token ) => {
			const savedTokenKey = `wc-${ method.gateway }-payment-token`;
			setActivePaymentMethod( method.gateway );
			setPaymentStatus().success( {
				payment_method: method.gateway,
				[ savedTokenKey ]: token,
				isSavedToken: true,
			} );
		},
	};
};

const SavedPaymentMethodOptions = ( { onSelect } ) => {
	const { isEditor } = useEditorContext();
	const {
		setPaymentStatus,
		customerPaymentMethods,
		setActivePaymentMethod,
	} = usePaymentMethodDataContext();
	const [ selectedToken, setSelectedToken ] = useState( '' );
	const standardMethods = getPaymentMethods();

	/**
	 * @type      {Object} Options
	 * @property  {Array}  current  The current options on the type.
	 */
	const currentOptions = useRef( [] );
	useEffect( () => {
		const types = Object.keys( customerPaymentMethods );
		const options = types
			.flatMap( ( type ) => {
				const typeMethods = customerPaymentMethods[ type ];
				return typeMethods.map( ( paymentMethod ) => {
					const method =
						standardMethods[ paymentMethod.method.gateway ];
					if ( ! method?.supports?.savePaymentInfo ) {
						return null;
					}
					const option =
						type === 'cc' || type === 'echeck'
							? getCcOrEcheckPaymentMethodOption(
									paymentMethod,
									setActivePaymentMethod,
									setPaymentStatus
							  )
							: getDefaultPaymentMethodOptions(
									paymentMethod,
									setActivePaymentMethod,
									setPaymentStatus
							  );
					if ( paymentMethod.is_default && selectedToken === '' ) {
						setSelectedToken( paymentMethod.tokenId + '' );
						option.onChange( paymentMethod.tokenId );
					}
					return option;
				} );
			} )
			.filter( Boolean );
		currentOptions.current = options;
	}, [
		customerPaymentMethods,
		selectedToken,
		setActivePaymentMethod,
		setPaymentStatus,
		standardMethods,
	] );

	const updateToken = useCallback(
		( token ) => {
			if ( token === '0' ) {
				setPaymentStatus().started();
			}
			setSelectedToken( token );
			onSelect( token );
		},
		[ setSelectedToken, setPaymentStatus, onSelect ]
	);
	useEffect( () => {
		if ( selectedToken && currentOptions.current.length > 0 ) {
			updateToken( selectedToken );
		}
	}, [ selectedToken, updateToken ] );

	// In the editor, show `Use a new payment method` option as selected.
	const selectedOption = isEditor ? '0' : selectedToken + '';
	const newPaymentMethodOption = {
		value: '0',
		label: __( 'Use a new payment method', 'woo-gutenberg-product-blocks' ),
		name: `wc-saved-payment-method-token-new`,
	};
	return currentOptions.current.length > 0 ? (
		<RadioControl
			id={ 'wc-payment-method-saved-tokens' }
			selected={ selectedOption }
			onChange={ updateToken }
			options={ [ ...currentOptions.current, newPaymentMethodOption ] }
		/>
	) : null;
};

export default SavedPaymentMethodOptions;
