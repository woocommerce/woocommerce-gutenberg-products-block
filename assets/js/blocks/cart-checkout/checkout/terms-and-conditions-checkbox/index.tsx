/**
 * External dependencies
 */
import { useState, ReactElement, useEffect } from 'react';
import CheckboxControl from '@woocommerce/base-components/checkbox-control';
import { __ } from '@wordpress/i18n';
import { useCheckoutContext } from '@woocommerce/base-context';
import { FormStep } from '@woocommerce/base-components/cart-checkout';
import { TERMS_URL, TERMS_PAGE_NAME } from '@woocommerce/block-settings';
import { createInterpolateElement } from 'wordpress-element';
import { getSetting } from '@woocommerce/settings';

/**
 * Internal dependencies
 */
import { useValidationContext } from '../../../../base/context/shared';

export const TermsAndConditionsCheckbox = (): ReactElement => {
	const {
		isProcessing: checkoutIsProcessing,
		isTermsAcceptedCheckboxPristine,
		dispatchActions,
	} = useCheckoutContext();

	const {
		setValidationErrors,
		clearValidationError,
		getValidationError,
	} = useValidationContext();

	const [ termsAndConditionsText, setTermsAndConditionsText ] = useState<
		string
	>( getSetting( 'terms_and_conditions_text' ) );

	useEffect( () => {
		let termsText = getSetting( 'terms_and_conditions_text' );
		if (
			typeof termsText === 'string' &&
			termsText.includes( '[terms]' )
		) {
			termsText = termsText.replace( /\[terms\]/, '<terms/>' );
		}
		setTermsAndConditionsText( termsText );
	}, [ getSetting ] );

	const isCheckboxInvalid =
		! isTermsAcceptedCheckboxPristine &&
		getValidationError( 'terms_and_conditions' );

	const setValidationError = () => {
		setValidationErrors( {
			terms_and_conditions: {
				message: __(
					'You must agree to the terms and conditions to continue.',
					'woo-gutenberg-products-block'
				),
				hidden: false,
			},
		} );
	};

	useEffect( setValidationError, [ setValidationErrors ] );
	return (
		<FormStep
			id="terms-and-conditions"
			showStepNumber={ true }
			title={ __( 'Terms and conditions', 'woocommerce' ) }
			className="wc-block-checkout__terms-and-conditions-checkbox"
			disabled={ checkoutIsProcessing }
		>
			<div className="wc-block-checkout__terms-and-conditions-checkbox">
				<CheckboxControl
					required={ true }
					onChange={ ( termsAccepted: boolean ) => {
						if ( isTermsAcceptedCheckboxPristine ) {
							dispatchActions.setIsTermsAcceptedCheckboxPristine(
								false
							);
						}
						if ( ! termsAccepted ) {
							setValidationError();
							return;
						}
						clearValidationError( 'terms_and_conditions' );
					} }
					label={ createInterpolateElement(
						// translators: <termsLink> is a link to the terms and conditions page of the site. The link text is the page's name.
						termsAndConditionsText,
						{
							terms: (
								<a
									href={ TERMS_URL }
									target="_blank"
									rel="noreferrer"
								>
									{ TERMS_PAGE_NAME }
								</a>
							),
						}
					) }
				/>
				{ isCheckboxInvalid && (
					<div className="wc-block-components-validation-error wc-block-components__terms-and-conditions-checkbox__validation-error">
						<p>
							{ __(
								'You must agree to the terms and conditions to continue.',
								'woo-gutenberg-products-block'
							) }
						</p>
					</div>
				) }
			</div>
		</FormStep>
	);
};
