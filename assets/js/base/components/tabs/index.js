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
	ariaLabel = __( 'Tabbed Content', 'woo-gutenberg-products-block' ),
	children,
	id,
} ) => {
	const tabState = useTabState();
	return (
		<div className={ classnames( 'wc-block-components-tabs', className ) }>
			<TabList
				{ ...tabState }
				id={ id }
				className={ 'wc-block-components-tabs__list' }
				aria-label={ ariaLabel }
			>
				{ tabs.map( ( tab ) => (
					<Tab
						{ ...tabState }
						id={ tab.name }
						className={ classnames(
							'wc-block-components-tabs__item',
							tab.className,
							{
								[ activeClass ]:
									tab.name === tabState.selectedId,
							}
						) }
						onClick={ () => onSelect( tab.name ) }
						type="button"
						key={ tab.name }
					>
						<span className="wc-block-components-tabs__item-content">
							{ tab.title() }
						</span>
					</Tab>
				) ) }
			</TabList>

			{ tabs.map( ( { name } ) => (
				<TabPanel { ...tabState } key={ name } tabId={ name }>
					{ children( name ) }
				</TabPanel>
			) ) }
		</div>
	);
};

export default withInstanceId( Tabs );
