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
	renderTab,
	id,
} ) => {
	const { selectedId, ...tabState } = useTabState();
	return (
		<>
			<TabList
				{ ...tabState }
				id={ id }
				className={ classnames(
					'wc-block-components-tabs',
					className
				) }
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
								[ activeClass ]: tab.name === selectedId,
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

			{ Object.keys( children ).map( ( name ) => (
				<TabPanel { ...tabState } key={ name } tabId={ name }>
					{ renderTab( name ) }
				</TabPanel>
			) ) }
		</>
	);
};

export default withInstanceId( Tabs );
