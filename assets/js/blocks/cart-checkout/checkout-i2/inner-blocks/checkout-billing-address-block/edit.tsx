/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	Disabled,
	CheckboxControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FormStepBlock } from '../../form-step';
import Block from './block';

export const Edit = ( {
	attributes: {
		showCompanyField,
		showApartmentField,
		requireCompanyField,
		...attributes
	},
	setAttributes,
}: {
	attributes: {
		title: string;
		description: string;
		showStepNumber: boolean;
		showCompanyField: boolean;
		showApartmentField: boolean;
		requireCompanyField: boolean;
	};
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	return (
		<FormStepBlock
			setAttributes={ setAttributes }
			attributes={ attributes }
			className="wc-block-checkout__billing-fields"
		>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Address options',
						'woo-gutenberg-products-block'
					) }
				>
					<p className="wc-block-checkout__controls-text">
						{ __(
							'Include additional address fields in the checkout form.',
							'woo-gutenberg-products-block'
						) }
					</p>
					<ToggleControl
						label={ __(
							'Company',
							'woo-gutenberg-products-block'
						) }
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
				</PanelBody>
			</InspectorControls>
			<Disabled>
				<Block
					showCompanyField={ showCompanyField }
					showApartmentField={ showApartmentField }
					requireCompanyField={ requireCompanyField }
				/>
			</Disabled>
		</FormStepBlock>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
