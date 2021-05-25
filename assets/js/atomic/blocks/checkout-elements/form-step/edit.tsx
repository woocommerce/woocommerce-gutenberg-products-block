/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import {
	PlainText,
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

/**
 * Internal dependencies
 */
import StepHeading from './step-heading';
import './style.scss';

export const Edit = ( {
	attributes: { title = '', description = '', showStepNumber = true },
	setAttributes,
}: {
	attributes: { title: string; description: string; showStepNumber: boolean };
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	const blockProps = useBlockProps( {
		className: classnames( 'wc-block-components-checkout-step', {
			'wc-block-components-checkout-step--with-step-number': showStepNumber,
		} ),
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __(
						'Form Step Options',
						'woo-gutenberg-products-block'
					) }
				>
					<ToggleControl
						label={ __(
							'Show step number?',
							'woo-gutenberg-products-block'
						) }
						checked={ showStepNumber }
						onChange={ () =>
							setAttributes( {
								showStepNumber: ! showStepNumber,
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<StepHeading>
				<PlainText
					className={ '' }
					value={ title }
					onChange={ ( value ) => setAttributes( { title: value } ) }
				/>
			</StepHeading>
			<div className="wc-block-components-checkout-step__container">
				<p className="wc-block-components-checkout-step__description">
					<PlainText
						className={ '' }
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
					/>
				</p>
				<div className="wc-block-components-checkout-step__content">
					<InnerBlocks
						allowedBlocks={ [] }
						template={ [] }
						templateLock={ false }
						orientation="vertical"
					/>
				</div>
			</div>
		</div>
	);
};

export const Save = (): JSX.Element => {
	return (
		<div
			{ ...useBlockProps.save( {
				className: 'is-loading',
			} ) }
		>
			<InnerBlocks.Content />
		</div>
	);
};
