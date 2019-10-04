/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';
import { Fragment } from 'react';
import { HOME_URL } from '@woocommerce/block-settings';

/**
 * Internal dependencies
 */
import CategorySelectOption from './option';
import withComponentId from '../../hocs/with-component-id';

const onNavigate = ( componentId ) => {
	const element = document.getElementById(
		`prod-categories-${ componentId }`
	);
	const url = element ? element.current.value : 'false';

	if ( 'false' === url ) {
		return;
	}

	if ( 0 === url.indexOf( HOME_URL ) ) {
		document.location.href = url;
	}
};

const CategorySelect = ( {
	attributes,
	categories = [],
	depth = 0,
	componentId,
} ) => {
	const selectId = `prod-categories-${ componentId }`;
	return (
		<Fragment>
			<div className="wc-block-product-categories__dropdown">
				<label className="screen-reader-text" htmlFor={ selectId }>
					{ __(
						'Select a category',
						'woo-gutenberg-products-block'
					) }
				</label>
				<select id={ selectId }>
					<option value="false" hidden>
						{ __(
							'Select a category',
							'woo-gutenberg-products-block'
						) }
					</option>
					{ categories.length > 0 &&
						categories.map( ( category, i ) => (
							<CategorySelectOption
								key={ category.term_id || i }
								attributes={ attributes }
								category={ category }
								depth={ depth }
							/>
						) ) }
				</select>
			</div>
			<button
				type="button"
				className="wc-block-product-categories__button"
				aria-label={ __(
					'Go to category',
					'woo-gutenberg-products-block'
				) }
				icon="arrow-right-alt2"
				onClick={ onNavigate( componentId ) }
			>
				<svg
					aria-hidden="true"
					role="img"
					focusable="false"
					className="dashicon dashicons-arrow-right-alt2"
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 20 20"
				>
					<path d="M6 15l5-5-5-5 1-2 7 7-7 7z" />
				</svg>
			</button>
		</Fragment>
	);
};

CategorySelect.propTypes = {
	attributes: PropTypes.object.isRequired,
	categories: PropTypes.array.isRequired,
	depth: PropTypes.number,
	// from withComponentId
	componentId: PropTypes.number.isRequired,
};

export default withComponentId( CategorySelect );
