/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { Disabled } from '@wordpress/components';

/**
 * Internal dependencies
 */
import LoadMoreButton from '../../base/components/load-more-button';
import ReviewList from '../../base/components/review-list';
import ReviewOrderSelect from '../../base/components/review-order-select';
import withComponentId from '../../base/hocs/with-component-id';
import withReviews from '../../base/hocs/with-reviews';
import NoReviewsPlaceholder from './all-reviews/no-reviews-placeholder.js';
import NoCategoryReviewsPlaceholder from './reviews-by-category/no-category-reviews-placeholder.js';
import NoProductReviewsPlaceholder from './reviews-by-product/no-product-reviews-placeholder.js';
import { ENABLE_REVIEW_RATING } from '../../constants';

/**
 * Block rendered in the editor.
 */
class EditorBlock extends Component {
	renderNoReviews() {
		const { attributes } = this.props;

		if ( attributes.productId ) {
			return <NoProductReviewsPlaceholder attributes={ attributes } />;
		}
		if ( attributes.categoryIds ) {
			return <NoCategoryReviewsPlaceholder attributes={ attributes } />;
		}
		return <NoReviewsPlaceholder attributes={ attributes } />;
	}

	render() {
		const { attributes, componentId, isLoading, reviews, totalReviews } = this.props;

		if ( 0 === reviews.length && ! isLoading ) {
			return this.renderNoReviews();
		}

		return (
			<Disabled>
				{ ( attributes.showOrderby && ENABLE_REVIEW_RATING ) && (
					<ReviewOrderSelect
						componentId={ componentId }
						readOnly
						value={ attributes.orderby }
					/>
				) }
				<ReviewList
					attributes={ attributes }
					componentId={ componentId }
					reviews={ reviews }
				/>
				{ ( attributes.showLoadMore && totalReviews > reviews.length ) && (
					<LoadMoreButton
						screenReaderLabel={ __( 'Load more reviews', 'woo-gutenberg-products-block' ) }
					/>
				) }
			</Disabled>
		);
	}
}

EditorBlock.propTypes = {
	/**
	 * The attributes for this block.
	 */
	attributes: PropTypes.object.isRequired,
	// from withComponentId
	componentId: PropTypes.number,
	// from withReviews
	reviews: PropTypes.array,
	totalReviews: PropTypes.number,
};

export default withComponentId( withReviews( EditorBlock ) );
