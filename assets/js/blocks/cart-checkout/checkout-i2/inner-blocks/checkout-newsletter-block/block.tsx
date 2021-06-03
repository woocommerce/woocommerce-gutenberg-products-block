/**
 * External dependencies
 */
import CheckboxControl from '@woocommerce/base-components/checkbox-control';
import { useState } from '@wordpress/element';
/**
 * Internal dependencies
 */

const Block = ( {
	optOut,
	description,
}: {
	optOut: boolean;
	description: string;
} ): JSX.Element => {
	const [ checked, setChecked ] = useState( optOut );
	return (
		<div className="wc-block-checkout__newsletter">
			<CheckboxControl
				id="newsletter"
				label={ description }
				checked={ checked }
				onChange={ () => setChecked( ! checked ) }
				className="components-base-control--nested"
			/>
		</div>
	);
};

export default Block;
