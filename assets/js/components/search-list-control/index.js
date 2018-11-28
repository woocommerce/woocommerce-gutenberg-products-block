/**
 * External dependencies
 */
import { __, _n, sprintf } from '@wordpress/i18n';
import {
	Button,
	MenuItem,
	MenuGroup,
	TextControl,
} from '@wordpress/components';
import { Component } from '@wordpress/element';
import { compose, withInstanceId, withState } from '@wordpress/compose';
import { escapeRegExp, findIndex } from 'lodash';
import PropTypes from 'prop-types';
import { Tag } from '@woocommerce/components';

/**
 * Internal dependencies
 */
import './style.scss';

/**
 * Component to display a searchable, selectable list of items.
 */
export class SearchListControl extends Component {
	constructor() {
		super( ...arguments );

		this.onSelect = this.onSelect.bind( this );
		this.onRemove = this.onRemove.bind( this );
		this.onClear = this.onClear.bind( this );
	}

	onRemove( id ) {
		const { selected, onChange } = this.props;
		return () => {
			const i = findIndex( selected, { id } );
			onChange( [ ...selected.slice( 0, i ), ...selected.slice( i + 1 ) ] );
		};
	}

	onSelect( item ) {
		const { selected, onChange } = this.props;
		return () => {
			onChange( [ ...selected, item ] );
		};
	}

	onClear() {
		this.props.onChange( [] );
	}

	isSelected( item ) {
		return -1 !== findIndex( this.props.selected, { id: item.id } );
	}

	getFilteredList( list, search ) {
		const re = new RegExp( escapeRegExp( search ), 'i' );
		return list
			.map( ( item ) => ( re.test( item.name ) ? item : false ) )
			.filter( Boolean );
	}

	getHighlightName( name, search ) {
		if ( ! search ) {
			return name;
		}
		const re = new RegExp( escapeRegExp( search ), 'ig' );
		return name.replace( re, '<strong>$&</strong>' );
	}

	render() {
		const { className, search, selected, setState } = this.props;

		const list = this.getFilteredList( this.props.list, search );
		return (
			<div className={ `woocommerce-search-list ${ className }` }>
				{ selected.length ? (
					<div className="woocommerce-search-list__selected">
						<div className="woocommerce-search-list__selected-header">
							<strong>
								{ sprintf(
									_n(
										'%d category selected',
										'%d categories selected',
										selected.length,
										'woocommerce'
									),
									selected.length
								) }
							</strong>
							<Button isLink onClick={ this.onClear }>
								{ __( 'Clear all', 'woocommerce' ) }
							</Button>
						</div>
						{ selected.map( ( item, i ) => (
							<Tag
								key={ i }
								label={ item.name }
								id={ item.id }
								remove={ this.onRemove }
							/>
						) ) }
					</div>
				) : null }

				<div className="woocommerce-search-list__search">
					<TextControl
						label={ __( 'Search for product categories', 'woocommerce' ) }
						value={ search }
						onChange={ ( value ) => setState( { search: value } ) }
					/>
				</div>

				<MenuGroup
					label={ __( 'Product Categories', 'woocommerce' ) }
					className="woocommerce-search-list__list"
				>
					{ list.map(
						( item ) =>
							this.isSelected( item ) ? null : (
								<MenuItem
									key={ item.id }
									className="woocommerce-search-list__item"
									onClick={ this.onSelect( item ) }
									aria-label={ sprintf(
										_n(
											'%s, has %d item',
											'%s, has %d items',
											item.count,
											'woocommerce'
										),
										item.name,
										item.count
									) }
								>
									<span
										className="woocommerce-search-list__item-name"
										dangerouslySetInnerHTML={ {
											__html: this.getHighlightName( item.name, search ),
										} }
									/>
									<span className="woocommerce-search-list__item-count">
										{ item.count }
									</span>
								</MenuItem>
							)
					) }
				</MenuGroup>
			</div>
		);
	}
}

SearchListControl.propTypes = {
	className: PropTypes.string,
	list: PropTypes.array,
	onChange: PropTypes.func,
	selected: PropTypes.array,
	// from withState
	search: PropTypes.string,
	setState: PropTypes.func,
	// from withInstanceId
	instanceId: PropTypes.string,
};

export default compose( [
	withState( {
		search: '',
	} ),
	withInstanceId,
] )( SearchListControl );
