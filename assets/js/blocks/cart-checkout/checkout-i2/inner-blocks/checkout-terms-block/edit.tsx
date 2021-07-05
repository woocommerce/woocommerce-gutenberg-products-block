/**
 * External dependencies
 */
import { useBlockProps, RichText } from '@wordpress/block-editor';
import CheckboxControl from '@woocommerce/base-components/checkbox-control';

/**
 * Internal dependencies
 */

export const Edit = ( {
	attributes: { checkbox, text },
	setAttributes,
}: {
	attributes: { text: string; checkbox: boolean };
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	return (
		<div className="wc-block-checkout__terms">
			{ checkbox ? (
				<>
					<CheckboxControl id="terms-condition" checked={ false } />
					<RichText
						value={ text }
						onChange={ ( value ) =>
							setAttributes( { text: value } )
						}
					/>
				</>
			) : (
				<RichText
					tagName="span"
					value={ text }
					onChange={ ( value ) => setAttributes( { text: value } ) }
				/>
			) }
		</div>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
