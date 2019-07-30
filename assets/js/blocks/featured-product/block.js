/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	PanelColorSettings,
	withColors,
} from '@wordpress/editor';
import {
	Button,
	FocalPointPicker,
	IconButton,
	PanelBody,
	Placeholder,
	RangeControl,
	ResizableBox,
	Spinner,
	ToggleControl,
	Toolbar,
	withSpokenMessages,
} from '@wordpress/components';
import classnames from 'classnames';
import { Component, Fragment } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { isObject, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import ProductControl from '../../components/product-control';
import ApiErrorPlaceholder from '../../components/api-error-placeholder';
import {
	getImageSrcFromProduct,
	getImageIdFromProduct,
} from '../../utils/products';
import withGetProduct from '../../utils/with-get-product';

/**
 * The min-height for the block content.
 */
const MIN_HEIGHT = wc_product_block_data.min_height;

/**
 * Generate a style object given either a product object or URL to an image.
 *
 * @param {object|string} url A product object as returned from the API, or an image URL.
 * @return {object} A style object with a backgroundImage set (if a valid image is provided).
 */
function backgroundImageStyles( url ) {
	// If `url` is an object, it's actually a product.
	if ( isObject( url ) ) {
		url = getImageSrcFromProduct( url );
	}
	if ( url ) {
		return { backgroundImage: `url(${ url })` };
	}
	return {};
}

/**
 * Convert the selected ratio to the correct background class.
 *
 * @param {number} ratio Selected opacity from 0 to 100.
 * @return {string} The class name, if applicable (not used for ratio 0 or 50).
 */
function dimRatioToClass( ratio ) {
	return ratio === 0 || ratio === 50 ?
		null :
		`has-background-dim-${ 10 * Math.round( ratio / 10 ) }`;
}

/**
 * Component to handle edit mode of "Featured Product".
 */
class FeaturedProduct extends Component {
	componentDidMount() {
		const { getProduct } = this.props;
		const { productId } = this.props.attributes;
		getProduct( productId );
	}

	componentDidUpdate( prevProps ) {
		const { debouncedGetProduct } = this.props;
		const { productId } = this.props.attributes;
		if ( prevProps.attributes.productId !== productId ) {
			debouncedGetProduct( productId );
		}
	}

	getInspectorControls() {
		const {
			attributes,
			setAttributes,
			overlayColor,
			product,
			setOverlayColor,
		} = this.props;

		const url = attributes.mediaSrc || getImageSrcFromProduct( product );
		const { focalPoint = { x: 0.5, y: 0.5 } } = attributes;

		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Content', 'woo-gutenberg-products-block' ) }>
					<ToggleControl
						label={ __( 'Show description', 'woo-gutenberg-products-block' ) }
						checked={ attributes.showDesc }
						onChange={ () => setAttributes( { showDesc: ! attributes.showDesc } ) }
					/>
					<ToggleControl
						label={ __( 'Show price', 'woo-gutenberg-products-block' ) }
						checked={ attributes.showPrice }
						onChange={ () => setAttributes( { showPrice: ! attributes.showPrice } ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Overlay', 'woo-gutenberg-products-block' ) }
					colorSettings={ [
						{
							value: overlayColor.color,
							onChange: setOverlayColor,
							label: __( 'Overlay Color', 'woo-gutenberg-products-block' ),
						},
					] }
				>
					<RangeControl
						label={ __( 'Background Opacity', 'woo-gutenberg-products-block' ) }
						value={ attributes.dimRatio }
						onChange={ ( ratio ) => setAttributes( { dimRatio: ratio } ) }
						min={ 0 }
						max={ 100 }
						step={ 10 }
					/>
					{ !! FocalPointPicker && !! url &&
						<FocalPointPicker
							label={ __( 'Focal Point Picker' ) }
							url={ url }
							value={ focalPoint }
							onChange={ ( value ) => setAttributes( { focalPoint: value } ) }
						/>
					}
				</PanelColorSettings>
			</InspectorControls>
		);
	}

	renderEditMode() {
		const { attributes, debouncedSpeak, setAttributes } = this.props;
		const onDone = () => {
			setAttributes( { editMode: false } );
			debouncedSpeak(
				__(
					'Showing Featured Product block preview.',
					'woo-gutenberg-products-block'
				)
			);
		};

		return (
			<Fragment>
				{ this.getBlockControls() }
				<Placeholder
					icon="star-filled"
					label={ __( 'Featured Product', 'woo-gutenberg-products-block' ) }
					className="wc-block-featured-product"
				>
					{ __(
						'Visually highlight a product or variation and encourage prompt action',
						'woo-gutenberg-products-block'
					) }
					<div className="wc-block-featured-product__selection">
						<ProductControl
							selected={ attributes.productId || 0 }
							onChange={ ( value = [] ) => {
								const id = value[ 0 ] ? value[ 0 ].id : 0;
								setAttributes( { productId: id, mediaId: 0, mediaSrc: '' } );
							} }
						/>
						<Button isDefault onClick={ onDone }>
							{ __( 'Done', 'woo-gutenberg-products-block' ) }
						</Button>
					</div>
				</Placeholder>
			</Fragment>
		);
	}

	renderApiError() {
		const { error, debouncedGetProduct, isLoading } = this.props;

		return (
			<ApiErrorPlaceholder
				className="wc-block-featured-product-error"
				errorMessage={ error.message }
				isLoading={ isLoading }
				onRetry={ debouncedGetProduct }
			/>
		);
	}

	getBlockControls() {
		const { attributes, product, setAttributes } = this.props;
		const { contentAlign, editMode } = attributes;
		const mediaId = attributes.mediaId || getImageIdFromProduct( product );

		return (
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ ( nextAlign ) => {
						setAttributes( { contentAlign: nextAlign } );
					} }
				/>
				<MediaUploadCheck>
					<Toolbar>
						<MediaUpload
							onSelect={ ( media ) => {
								setAttributes( { mediaId: media.id, mediaSrc: media.url } );
							} }
							allowedTypes={ [ 'image' ] }
							value={ mediaId }
							render={ ( { open } ) => (
								<IconButton
									className="components-toolbar__control"
									label={ __( 'Edit media' ) }
									icon="format-image"
									onClick={ open }
									disabled={ ! product }
								/>
							) }
						/>
					</Toolbar>
				</MediaUploadCheck>
				<Toolbar
					controls={ [
						{
							icon: 'edit',
							title: __( 'Edit' ),
							onClick: () => setAttributes( { editMode: ! editMode } ),
							isActive: editMode,
						},
					] }
				/>
			</BlockControls>
		);
	}

	renderProduct() {
		const { attributes, isLoading, isSelected, overlayColor, product, setAttributes } = this.props;
		const {
			className,
			contentAlign,
			dimRatio,
			focalPoint,
			height,
			showDesc,
			showPrice,
		} = attributes;
		const classes = classnames(
			'wc-block-featured-product',
			{
				'is-selected': isSelected,
				'is-loading': ! product && isLoading,
				'is-not-found': ! product && ! isLoading,
				'has-background-dim': dimRatio !== 0,
			},
			dimRatioToClass( dimRatio ),
			contentAlign !== 'center' && `has-${ contentAlign }-content`,
			className,
		);

		const style = backgroundImageStyles( attributes.mediaSrc || product );

		if ( overlayColor.color ) {
			style.backgroundColor = overlayColor.color;
		}
		if ( focalPoint ) {
			style.backgroundPosition = `${ focalPoint.x * 100 }% ${ focalPoint.y *
				100 }%`;
		}

		const onResizeStop = ( event, direction, elt ) => {
			setAttributes( { height: parseInt( elt.style.height ) } );
		};

		return (
			<ResizableBox
				className={ classes }
				size={ { height } }
				minHeight={ MIN_HEIGHT }
				enable={ { bottom: true } }
				onResizeStop={ onResizeStop }
				style={ style }
			>
				<div className="wc-block-featured-product__wrapper">
					<h2
						className="wc-block-featured-product__title"
						dangerouslySetInnerHTML={ {
							__html: product.name,
						} }
					/>
					{ ! isEmpty( product.variation ) && (
						<h3
							className="wc-block-featured-product__variation"
							dangerouslySetInnerHTML={ {
								__html: product.variation,
							} }
						/>
					) }
					{ showDesc && (
						<div
							className="wc-block-featured-product__description"
							dangerouslySetInnerHTML={ {
								__html: product.description,
							} }
						/>
					) }
					{ showPrice && (
						<div
							className="wc-block-featured-product__price"
							dangerouslySetInnerHTML={ { __html: product.price_html } }
						/>
					) }
					<div className="wc-block-featured-product__link">
						<InnerBlocks
							template={ [
								[
									'core/button',
									{
										text: __(
											'Shop now',
											'woo-gutenberg-products-block'
										),
										url: product.permalink,
										align: 'center',
									},
								],
							] }
							templateLock="all"
						/>
					</div>
				</div>
			</ResizableBox>
		);
	}

	renderNoProduct() {
		const { isLoading } = this.props;

		return (
			<Placeholder
				className="wc-block-featured-product"
				icon="star-filled"
				label={ __( 'Featured Product', 'woo-gutenberg-products-block' ) }
			>
				{ isLoading ? (
					<Spinner />
				) : (
					__( 'No product is selected.', 'woo-gutenberg-products-block' )
				) }
			</Placeholder>
		);
	}

	render() {
		const { attributes, error, product } = this.props;
		const { editMode } = attributes;

		// If there was an API error, render it.
		if ( error ) {
			return this.renderApiError();
		}

		// If editing, show edit controls.
		if ( editMode ) {
			return this.renderEditMode();
		}

		// Otherwise render the selected product!
		return (
			<Fragment>
				{ this.getBlockControls() }
				{ this.getInspectorControls() }
				{ !! product ? (
					this.renderProduct()
				) : (
					this.renderNoProduct()
				) }
			</Fragment>
		);
	}
}

FeaturedProduct.propTypes = {
	/**
	 * The attributes for this block.
	 */
	attributes: PropTypes.object.isRequired,
	/**
	 * Whether this block is currently active.
	 */
	isSelected: PropTypes.bool.isRequired,
	/**
	 * The register block name.
	 */
	name: PropTypes.string.isRequired,
	/**
	 * A callback to update attributes.
	 */
	setAttributes: PropTypes.func.isRequired,
	// from withGetProduct
	debouncedGetProduct: PropTypes.func,
	error: PropTypes.object,
	getProduct: PropTypes.func,
	isLoading: PropTypes.bool,
	product: PropTypes.shape( {
		name: PropTypes.node,
		variation: PropTypes.node,
		description: PropTypes.node,
		price_html: PropTypes.node,
		permalink: PropTypes.string,
	} ),
	// from withColors
	overlayColor: PropTypes.object,
	setOverlayColor: PropTypes.func.isRequired,
	// from withSpokenMessages
	debouncedSpeak: PropTypes.func.isRequired,
};

export default compose( [
	withGetProduct,
	withColors( { overlayColor: 'background-color' } ),
	withSpokenMessages,
] )( FeaturedProduct );
