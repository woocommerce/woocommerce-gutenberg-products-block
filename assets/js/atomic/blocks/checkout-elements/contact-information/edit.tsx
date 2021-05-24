/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Block from './block';

const Edit = ( {
	attributes: { allowCreateAccount = true },
	setAttributes,
}: {
	attributes: { allowCreateAccount: boolean };
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	return (
		<>
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
		</>
	);
};

export default Edit;
