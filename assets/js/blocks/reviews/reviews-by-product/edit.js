/**
 * External dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
} from '@wordpress/editor';
import {
	Button,
	PanelBody,
	Placeholder,
	Toolbar,
	withSpokenMessages,
} from '@wordpress/components';
import { SearchListItem } from '@woocommerce/components';
import { Fragment } from '@wordpress/element';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import EditorBlock from './editor-block.js';
import ProductControl from '../../../components/product-control';
import { IconReviewsByProduct } from '../../../components/icons';
import { getSharedReviewContentControls, getSharedReviewListControls } from '../edit.js';
import { getBlockClassName, getOrderArgs } from '../utils.js';

/**
 * Component to handle edit mode of "Reviews by Product".
 */
const ReviewsByProductEditor = ( { attributes, debouncedSpeak, setAttributes } ) => {
	const { editMode, productId, showReviewDate, showReviewerName, showReviewContent, showReviewImage, showReviewRating } = attributes;

	const getBlockControls = () => (
		<BlockControls>
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

	const renderProductControlItem = ( args ) => {
		const { item = 0 } = args;

		return (
			<SearchListItem
				{ ...args }
				countLabel={ sprintf(
					_n(
						'%d Review',
						'%d Reviews',
						item.review_count,
						'woo-gutenberg-products-block'
					),
					item.review_count
				) }
				showCount
				aria-label={ sprintf(
					_n(
						'%s, has %d review',
						'%s, has %d reviews',
						item.review_count,
						'woo-gutenberg-products-block'
					),
					item.name,
					item.review_count
				) }
			/>
		);
	};

	const getInspectorControls = () => {
		return (
			<InspectorControls key="inspector">
				<PanelBody
					title={ __( 'Product', 'woo-gutenberg-products-block' ) }
					initialOpen={ false }
				>
					<ProductControl
						selected={ attributes.productId || 0 }
						onChange={ ( value = [] ) => {
							const id = value[ 0 ] ? value[ 0 ].id : 0;
							setAttributes( { productId: id } );
						} }
						renderItem={ renderProductControlItem }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Content', 'woo-gutenberg-products-block' ) }>
					{ getSharedReviewContentControls( attributes, setAttributes ) }
				</PanelBody>
				<PanelBody title={ __( 'List Settings', 'woo-gutenberg-products-block' ) }>
					{ getSharedReviewListControls( attributes, setAttributes ) }
				</PanelBody>
			</InspectorControls>
		);
	};

	const renderEditMode = () => {
		const onDone = () => {
			setAttributes( { editMode: false } );
			debouncedSpeak(
				__(
					'Showing Reviews by Product block preview.',
					'woo-gutenberg-products-block'
				)
			);
		};

		return (
			<Placeholder
				icon={ <IconReviewsByProduct className="block-editor-block-icon" /> }
				label={ __( 'Reviews by Product', 'woo-gutenberg-products-block' ) }
			>
				{ __(
					'Show reviews of your product to build trust',
					'woo-gutenberg-products-block'
				) }
				<div className="wc-block-reviews__selection">
					<ProductControl
						selected={ attributes.productId || 0 }
						onChange={ ( value = [] ) => {
							const id = value[ 0 ] ? value[ 0 ].id : 0;
							setAttributes( { productId: id } );
						} }
						queryArgs={ {
							orderby: 'comment_count',
							order: 'desc',
						} }
						renderItem={ renderProductControlItem }
					/>
					<Button isDefault onClick={ onDone }>
						{ __( 'Done', 'woo-gutenberg-products-block' ) }
					</Button>
				</div>
			</Placeholder>
		);
	};

	const renderHiddenContentPlaceholder = () => {
		return (
			<Placeholder
				icon={ <IconReviewsByProduct className="block-editor-block-icon" /> }
				label={ __( 'Reviews by Product', 'woo-gutenberg-products-block' ) }
			>
				{ __( 'The content for this block is hidden due to block settings.', 'woo-gutenberg-products-block' ) }
			</Placeholder>
		);
	};

	const renderViewMode = () => {
		if ( ! showReviewContent && ! showReviewRating && ! showReviewDate && ! showReviewerName && ! showReviewImage ) {
			return renderHiddenContentPlaceholder();
		}

		const { reviewsOnPageLoad } = attributes;
		const { order, orderby } = getOrderArgs( attributes.orderby );

		return (
			<div className={ getBlockClassName( 'wc-block-reviews-by-product', attributes ) }>
				<EditorBlock
					attributes={ attributes }
					delayFunction={ ( callback ) => debounce( callback, 400 ) }
					orderby={ orderby }
					order={ order }
					productId={ productId }
					reviewsToDisplay={ reviewsOnPageLoad }
				/>
			</div>
		);
	};

	if ( ! productId || editMode ) {
		return renderEditMode();
	}

	return (
		<Fragment>
			{ getBlockControls() }
			{ getInspectorControls() }
			{ renderViewMode() }
		</Fragment>
	);
};

ReviewsByProductEditor.propTypes = {
	/**
	 * The attributes for this block.
	 */
	attributes: PropTypes.object.isRequired,
	/**
	 * The register block name.
	 */
	name: PropTypes.string.isRequired,
	/**
	 * A callback to update attributes.
	 */
	setAttributes: PropTypes.func.isRequired,
	// from withSpokenMessages
	debouncedSpeak: PropTypes.func.isRequired,
};

export default withSpokenMessages( ReviewsByProductEditor );
