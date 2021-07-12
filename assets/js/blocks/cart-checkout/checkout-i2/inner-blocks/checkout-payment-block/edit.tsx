/**
 * External dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { FormStepBlock, FormStepBlockProps } from '../../form-step';
import Block from './block';

export const Edit = ( props: FormStepBlockProps ): JSX.Element => {
	return (
		<FormStepBlock
			{ ...props }
			className="wc-block-checkout__payment-method"
		>
			<Disabled>
				<Block />
			</Disabled>
		</FormStepBlock>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
