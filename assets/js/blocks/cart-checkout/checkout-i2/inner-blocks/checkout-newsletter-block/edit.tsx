/**
 * External dependencies
 */
import {
	useBlockProps,
	PlainText,
	InspectorControls,
} from '@wordpress/block-editor';
import CheckboxControl from '@woocommerce/base-components/checkbox-control';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */

export const Edit = ( {
	attributes: { optOut, description },
	setAttributes,
}: {
	attributes: { description: string; optOut: boolean };
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ 'Default state' }>
					<ToggleControl
						label={ 'If this should be opt in or opt out' }
						checked={ optOut }
						onChange={ () =>
							setAttributes( {
								optOut: ! optOut,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<div className="wc-blocks-newsletter">
				<CheckboxControl
					id="newsletter"
					checked={ optOut }
					onChange={ () => setAttributes( { optOut: ! optOut } ) }
					className="components-base-control--nested"
				/>
				<PlainText
					className={ '' }
					value={ description }
					onChange={ ( value ) =>
						setAttributes( { description: value } )
					}
				/>
			</div>
		</div>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
