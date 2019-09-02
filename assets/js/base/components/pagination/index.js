/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Label from '../label';
import { getIndexes } from './utils.js';
import './style.scss';

const Pagination = ( { currentPage, pagesToDisplay, onPageChange, totalPages } ) => {
	const { minIndex, maxIndex } = getIndexes( pagesToDisplay, currentPage, totalPages );
	const pages = [];
	for ( let i = minIndex; i <= maxIndex; i++ ) {
		pages.push( i );
	}
	const showPreviousArrow = minIndex !== 1;
	const showNextArrow = maxIndex !== totalPages;

	return (
		<div className="wc-block-pagination">
			<Label
				screenReaderLabel={ __( 'Navigate to another page', 'woo-gutenberg-products-block' ) }
			/>
			{ showPreviousArrow && (
				<button
					className="wc-block-pagination-page"
					onClick={ () => onPageChange( 1 ) }
					title={ __( 'First page', 'woo-gutenberg-products-block' ) }
				>
					<Label
						label="<"
						screenReaderLabel={ __( 'First page', 'woo-gutenberg-products-block' ) }
					/>
				</button>
			) }
			{ pages.map( ( page ) => {
				return (
					<button
						key={ page }
						className={ classNames( 'wc-block-pagination-page', {
							'wc-block-pagination-page--active': currentPage === page,
						} ) }
						onClick={ currentPage === page ? null : () => onPageChange( page ) }
					>
						{ page }
					</button>
				);
			} ) }
			{ showNextArrow && (
				<button
					className="wc-block-pagination-page"
					onClick={ () => onPageChange( totalPages ) }
					title={ __( 'Last page', 'woo-gutenberg-products-block' ) }
				>
					<Label
						label=">"
						screenReaderLabel={ __( 'Last page', 'woo-gutenberg-products-block' ) }
					/>
				</button>
			) }
		</div>
	);
};

Pagination.propTypes = {
	/**
	 * Number of the page currently being displayed.
	 */
	currentPage: PropTypes.number.isRequired,
	/**
	 * Total number of pages.
	 */
	totalPages: PropTypes.number.isRequired,
	/**
	 * Callback function called when the user triggers a page change.
	 */
	onPageChange: PropTypes.func,
	/**
	 * Number of pages to display at the same time, including the active page
	 * and the pages displayed before and after it.
	 */
	pagesToDisplay: PropTypes.number,
};

Pagination.defaultProps = {
	pagesToDisplay: 3,
};

export default Pagination;
