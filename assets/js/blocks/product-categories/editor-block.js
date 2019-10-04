/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from 'react';
import classnames from 'classnames';
import { Placeholder } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { formatCategories } from './utils';
import { withCategories } from '../../hocs';
import CategoryList from '../../base/components/category-list';
import CategorySelect from '../../base/components/category-select';
import { IconFolder } from '../../components/icons';

/**
 * Component displaying the categories as dropdown or list.
 */
class EditorBlock extends Component {
	render() {
		const { attributes, isLoading = true } = this.props;
		const { className, isDropdown } = attributes;
		const classes = classnames( 'wc-block-product-categories', className, {
			'is-dropdown': isDropdown,
			'is-list': ! isDropdown,
		} );
		const categories = this.props.categories || [];

		if ( isLoading ) {
			return (
				<div className={ classes }>
					{ isDropdown ? (
						<CategorySelect attributes={ attributes } categories={ [] } />
					) : (
						<CategoryList attributes={ attributes } categories={ [] } />
					) }
				</div>
			);
		}

		// Ensure API matches with setting.
		categories.map( ( category ) => {
			category.term_id = category.term_id || category.id;
			return category;
		} );

		const categoryTree = formatCategories( categories, attributes );

		return (
			<Fragment>
				{ categoryTree.length > 0 ? (
					<div className={ classes }>
						{ isDropdown ? (
							<CategorySelect categories={ categoryTree } attributes={ attributes } />
						) : (
							<CategoryList categories={ categoryTree } attributes={ attributes } />
						) }
					</div>
				) : (
					<Placeholder
						className="wc-block-product-categories"
						icon={ <IconFolder /> }
						label={ __(
							'Product Categories List',
							'woo-gutenberg-products-block'
						) }
					>
						{ __(
							"This block shows product categories for your store. In order to preview this you'll first need to create a product and assign it to a category.",
							'woo-gutenberg-products-block'
						) }
					</Placeholder>
				) }
			</Fragment>
		);
	}
}

export default withCategories( EditorBlock );
