/**
 * External dependencies
 */
import { Component, Fragment } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { formatCategories } from './utils';
import CategoryList from '../../base/components/category-list';
import CategorySelect from '../../base/components/category-select';

/**
 * Component displaying the categories as dropdown or list.
 */
class FrontendBlock extends Component {
	render() {
		const { attributes, categories } = this.props;
		const { className, isDropdown } = attributes;
		const classes = classnames( 'wc-block-product-categories', className, {
			'is-dropdown': isDropdown,
			'is-list': ! isDropdown,
		} );
		const categoryTree = formatCategories( categories || [], attributes );

		return (
			<Fragment>
				{ categoryTree.length > 0 && (
					<div className={ classes }>
						{ isDropdown ? (
							<CategorySelect categories={ categoryTree } attributes={ attributes } />
						) : (
							<CategoryList categories={ categoryTree } attributes={ attributes } />
						) }
					</div>
				) }
			</Fragment>
		);
	}
}

export default FrontendBlock;
