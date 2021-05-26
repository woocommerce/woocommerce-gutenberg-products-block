/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FormStepBlock } from '../../form-step';
import Block from './block';

export const Edit = ( {
	attributes,
	setAttributes,
}: {
	attributes: {
		title: string;
		description: string;
		showStepNumber: boolean;
		allowCreateAccount: boolean;
	};
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	const { allowCreateAccount = true } = attributes;

	return (
		<FormStepBlock
			attributes={ attributes }
			setAttributes={ setAttributes }
		>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Account options',
						'woo-gutenberg-products-block'
					) }
				>
					<ToggleControl
						label={ __(
							'Allow shoppers to sign up for a user account during checkout',
							'woo-gutenberg-products-block'
						) }
						checked={ allowCreateAccount }
						onChange={ () =>
							setAttributes( {
								allowCreateAccount: ! allowCreateAccount,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<Disabled>
				<Block allowCreateAccount={ allowCreateAccount } />
			</Disabled>
		</FormStepBlock>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
