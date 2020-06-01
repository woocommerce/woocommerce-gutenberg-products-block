/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { decodeEntities } from '@wordpress/html-entities';
import {
	useInnerBlockLayoutContext,
	useProductDataContext,
} from '@woocommerce/shared-context';

/**
 * Product Title Block Component.
 *
 * @param {Object}  props                Incoming props.
 * @param {string}  [props.className]    CSS Class name for the component.
 * @param {number}  [props.headingLevel] Heading level (h1, h2 etc)
 * @param {boolean} [props.productLink]  Whether or not to display a link to the product page.
 * @param {Object}  [props.product]      Optional product object. Product from context will be used if
 *                                       this is not provided.
 * @return {*} The component.
 */
const ProductTitle = ( {
	className,
	headingLevel = 2,
	productLink = true,
	...props
} ) => {
	const productDataContext = useProductDataContext();
	const product = props.product || productDataContext.product;
	const { parentClassName } = useInnerBlockLayoutContext();
	const TagName = `h${ headingLevel }`;

	if ( ! product ) {
		return (
			<TagName
				// @ts-ignore
				className={ classnames(
					className,
					`${ parentClassName }__product-title`
				) }
			/>
		);
	}

	const productName = decodeEntities( product.name );

	return (
		// @ts-ignore
		<TagName
			className={ classnames(
				className,
				`${ parentClassName }__product-title`
			) }
		>
			{ productLink ? (
				<a href={ product.permalink } rel="nofollow">
					{ productName }
				</a>
			) : (
				productName
			) }
		</TagName>
	);
};

ProductTitle.propTypes = {
	className: PropTypes.string,
	product: PropTypes.object,
	headingLevel: PropTypes.number,
	productLink: PropTypes.bool,
};

export default ProductTitle;
