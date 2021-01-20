/**
 * External dependencies
 */
import { ExperimentalOrderShippingPackages } from '@woocommerce/blocks-checkout';
import { registerPlugin } from '@wordpress/plugins';
import { useStoreCart, useSelectShippingRate } from '@woocommerce/base-hooks';
import { useMemo } from '@wordpress/element';
import Package from '@woocommerce/base-components/cart-checkout/shipping-rates-control/package.js';

const RenderSubscriptionPackages = () => {
	const {
		extensions: { subscriptions },
	} = useStoreCart();

	// Flatten all packages from recurring carts.
	const packages = useMemo( () => {
		const newPackages = [];

		Object.values( subscriptions ).forEach( ( recurringCart ) => {
			const recurringCartPackages = recurringCart.shipping_rates || [];

			recurringCartPackages.forEach( ( recurringCartPackage ) => {
				newPackages.push( recurringCartPackage );
			} );
		} );

		return newPackages;
	}, [ subscriptions ] );

	const { selectShippingRate, selectedShippingRates } = useSelectShippingRate(
		packages
	);

	return packages.map( ( { package_id: packageId, ...packageData } ) => (
		<ExperimentalOrderShippingPackages key={ packageId }>
			<SubscriptionPackage
				key={ packageId }
				packageData={ packageData }
				onSelectRate={ ( newShippingRate ) => {
					selectShippingRate( newShippingRate, packageId );
				} }
				selected={ selectedShippingRates[ packageId ] }
			/>
		</ExperimentalOrderShippingPackages>
	) );
};

const SubscriptionPackage = ( props ) => {
	return <Package { ...props } />;
};

registerPlugin( 'woocommerce-subscriptions-shipping', {
	render: RenderSubscriptionPackages,
} );
