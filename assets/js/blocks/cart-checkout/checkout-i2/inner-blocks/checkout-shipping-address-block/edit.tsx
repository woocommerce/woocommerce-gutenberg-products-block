/**
 * External dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FormStepBlock } from '../../form-step';
import { CheckoutFieldsBlockContext } from '../checkout-fields-block/edit';
import Block from './block';

export const Edit = ( {
	attributes,
	context,
	setAttributes,
}: {
	attributes: {
		title: string;
		description: string;
		showStepNumber: boolean;
	};
	context: {
		'woocommerce/showCompanyField': boolean;
		'woocommerce/showApartmentField': boolean;
		'woocommerce/requireCompanyField': boolean;
		'woocommerce/showPhoneField': boolean;
		'woocommerce/requirePhoneField': boolean;
	};
	setAttributes: ( attributes: Record< string, unknown > ) => void;
} ): JSX.Element => {
	const { controls: FieldControls } = useContext(
		CheckoutFieldsBlockContext
	);
	return (
		<FormStepBlock
			setAttributes={ setAttributes }
			attributes={ attributes }
			className="wc-block-checkout__shipping-fields"
		>
			<FieldControls />
			<Disabled>
				<Block
					showCompanyField={
						context[ 'woocommerce/showCompanyField' ]
					}
					showApartmentField={
						context[ 'woocommerce/showApartmentField' ]
					}
					requireCompanyField={
						context[ 'woocommerce/requireCompanyField' ]
					}
					showPhoneField={ context[ 'woocommerce/showPhoneField' ] }
					requirePhoneField={
						context[ 'woocommerce/requirePhoneField' ]
					}
				/>
			</Disabled>
		</FormStepBlock>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
