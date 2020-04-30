/**
 * External dependencies
 */
import { withInstanceId } from '@woocommerce/base-hocs/with-instance-id';
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab';
/**
 * Internal dependencies
 */
import './style.scss';

const Tabs = ( {
	className,
	onSelect = () => null,
	tabs,
	activeClass = 'is-active',
	initialTabName,
	ariaLabel = __( 'Tabbed Content', 'woo-gutenberg-products-block' ),
	children,
	instanceId,
	id,
} ) => {
	const tabState = useTabState( {
		selectedId: `${ instanceId }-${
			initialTabName ? initialTabName : tabs[ 0 ].name
		}`,
	} );
	if ( tabs.length === 0 ) {
		return null;
	}
	if ( ! tabState.selectedId ) {
		throw new Error( 'There is no available tab for the selected item' );
	}
	return (
		<div className={ classnames( 'wc-block-components-tabs', className ) }>
			<TabList
				{ ...tabState }
				id={ id }
				className={ 'wc-block-components-tabs__list' }
				aria-label={ ariaLabel }
			>
				{ tabs.map( ( { name, title, ariaLabel: tabAriaLabel } ) => (
					<Tab
						{ ...tabState }
						id={ `${ instanceId }-${ name }` }
						className={ classnames(
							'wc-block-components-tabs__item',
							{
								[ activeClass ]:
									// reakit uses the ID as the selectedId
									`${ instanceId }-${ name }` ===
									tabState.selectedId,
							}
						) }
						onClick={ () => onSelect( name ) }
						type="button"
						key={ name }
						aria-label={ tabAriaLabel }
					>
						<span className="wc-block-components-tabs__item-content">
							{ title }
						</span>
					</Tab>
				) ) }
			</TabList>

			{ tabs.map( ( { name } ) => (
				<TabPanel
					{ ...tabState }
					key={ name }
					id={ `${ instanceId }-${ name }-view` }
					tabId={ `${ instanceId }-${ name }` }
					className="wc-block-components-tabs__content"
				>
					{ children( name ) }
				</TabPanel>
			) ) }
		</div>
	);
};

export default withInstanceId( Tabs );
