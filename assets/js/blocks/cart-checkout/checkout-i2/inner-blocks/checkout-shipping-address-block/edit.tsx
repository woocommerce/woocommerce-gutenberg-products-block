/**
 * External dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';
import { Disabled } from '@wordpress/components';
import { AddressForm } from '@woocommerce/base-components/cart-checkout';
import { useCheckoutAddress } from '@woocommerce/base-context';

/**
 * Internal dependencies
 */
import { FormStepBlock, FormStepBlockProps } from '../../form-step';

export const Edit = ( props: FormStepBlockProps ): JSX.Element => {
	const {
		defaultAddressFields,
		setShippingFields,
		shippingFields,
	} = useCheckoutAddress();

	return (
		<FormStepBlock { ...props }>
			<Disabled>
				<AddressForm
					id="shipping"
					type="shipping"
					values={ shippingFields }
					onChange={ setShippingFields }
					fields={ Object.keys( defaultAddressFields ) }
					fieldConfig={ {} }
				/>
			</Disabled>
		</FormStepBlock>
	);
};

export const Save = (): JSX.Element => {
	return <div { ...useBlockProps.save() } />;
};
