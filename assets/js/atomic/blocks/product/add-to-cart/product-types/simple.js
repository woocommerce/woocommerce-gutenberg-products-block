/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	useAddToCartFormContext,
	AddToCartButton,
	QuantityInput,
	ProductUnavailable,
} from '../shared';

/**
 * Simple Product Add To Cart Form
 */
const Simple = () => {
	const {
		hasProduct,
		product,
		quantity,
		setQuantity,
		addingToCart,
	} = useAddToCartFormContext();

	const {
		is_in_stock: isInStock = true,
		is_purchasable: isPurchasable = true,
		quantity_limit: quantityLimit = 99,
	} = product;

	if ( ! isPurchasable ) {
		return <ProductUnavailable />;
	}

	if ( ! isInStock ) {
		return (
			<ProductUnavailable
				reason={ __(
					'This product is currently out of stock and cannot be purchased.',
					'woo-gutenberg-products-block'
				) }
			/>
		);
	}

	return (
		<>
			<QuantityInput
				value={ quantity }
				min={ 1 }
				max={ quantityLimit }
				disabled={ addingToCart || ! hasProduct }
				onChange={ setQuantity }
			/>
			<AddToCartButton />
		</>
	);
};

export default Simple;
