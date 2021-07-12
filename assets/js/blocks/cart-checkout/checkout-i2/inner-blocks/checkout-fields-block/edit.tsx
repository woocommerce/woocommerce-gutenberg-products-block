/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { Main } from '@woocommerce/base-components/sidebar-layout';
import { getRegisteredBlocks } from '@woocommerce/blocks-checkout';
import {
	PanelBody,
	ToggleControl,
	CheckboxControl,
} from '@wordpress/components';
import { createContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { InnerBlockTemplate } from '../../types';

const ALLOWED_BLOCKS = [
	'woocommerce/checkout-express-payment-block',
	'woocommerce/checkout-shipping-address-block',
	'woocommerce/checkout-shipping-methods-block',
	'woocommerce/checkout-contact-information-block',
	'woocommerce/checkout-billing-address-block',
	'woocommerce/checkout-payment-block',
	'woocommerce/checkout-order-note-block',
	'woocommerce/checkout-actions-block',
	'woocommerce/checkout-terms-block',
	...getRegisteredBlocks( 'fields' ),
];
const TEMPLATE: InnerBlockTemplate[] = [
	[ 'woocommerce/checkout-express-payment-block', {}, [] ],
	[ 'woocommerce/checkout-contact-information-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-address-block', {}, [] ],
	[ 'woocommerce/checkout-billing-address-block', {}, [] ],
	[ 'woocommerce/checkout-shipping-methods-block', {}, [] ],
	[ 'woocommerce/checkout-payment-block', {}, [] ],
	[ 'woocommerce/checkout-order-note-block', {}, [] ],
	[ 'woocommerce/checkout-actions-block', {}, [] ],
];

export const CheckoutFieldsBlockContext = createContext( {
	controls: () => null as JSX.Element | null,
} );

// @todo templateLock all prevents load after saving content for some reason.
export const Edit = ( {
	attributes: {
		showCompanyField,
		showApartmentField,
		showPhoneField,
		requireCompanyField,
		requirePhoneField,
	},
	setAttributes,
}: {
	attributes: {
		showCompanyField: boolean;
		showApartmentField: boolean;
		showPhoneField: boolean;
		requireCompanyField: boolean;
		requirePhoneField: boolean;
	};
	setAttributes: ( attributes: Record< string, unknown > ) => undefined;
} ): JSX.Element => {
	const blockProps = useBlockProps();
	const FieldControls = () => (
		<InspectorControls>
			<PanelBody
				title={ __( 'Address Fields', 'woo-gutenberg-products-block' ) }
			>
				<p className="wc-block-checkout__controls-text">
					{ __(
						'Show or hide fields in the checkout address forms.',
						'woo-gutenberg-products-block'
					) }
				</p>
				<ToggleControl
					label={ __( 'Company', 'woo-gutenberg-products-block' ) }
					checked={ showCompanyField }
					onChange={ () =>
						setAttributes( {
							showCompanyField: ! showCompanyField,
						} )
					}
				/>
				{ showCompanyField && (
					<CheckboxControl
						label={ __(
							'Require company name?',
							'woo-gutenberg-products-block'
						) }
						checked={ requireCompanyField }
						onChange={ () =>
							setAttributes( {
								requireCompanyField: ! requireCompanyField,
							} )
						}
						className="components-base-control--nested"
					/>
				) }
				<ToggleControl
					label={ __(
						'Apartment, suite, etc.',
						'woo-gutenberg-products-block'
					) }
					checked={ showApartmentField }
					onChange={ () =>
						setAttributes( {
							showApartmentField: ! showApartmentField,
						} )
					}
				/>
				<ToggleControl
					label={ __( 'Phone', 'woo-gutenberg-products-block' ) }
					checked={ showPhoneField }
					onChange={ () =>
						setAttributes( {
							showPhoneField: ! showPhoneField,
						} )
					}
				/>
				{ showPhoneField && (
					<CheckboxControl
						label={ __(
							'Require phone number?',
							'woo-gutenberg-products-block'
						) }
						checked={ requirePhoneField }
						onChange={ () =>
							setAttributes( {
								requirePhoneField: ! requirePhoneField,
							} )
						}
						className="components-base-control--nested"
					/>
				) }
			</PanelBody>
		</InspectorControls>
	);

	return (
		<Main className="wc-block-checkout__main">
			<div { ...blockProps }>
				<FieldControls />
				<form className="wc-block-components-form wc-block-checkout__form">
					<CheckoutFieldsBlockContext.Provider
						value={ { controls: FieldControls } }
					>
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							templateLock={ false }
						/>
					</CheckoutFieldsBlockContext.Provider>
				</form>
			</div>
		</Main>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div { ...useBlockProps.save() }>
			<InnerBlocks.Content />
		</div>
	);
};
