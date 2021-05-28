/**
 * External dependencies
 */
import { Sidebar } from '@woocommerce/base-components/sidebar-layout';

const FrontendBlock = ( {
	children,
}: {
	children: JSX.Element;
} ): JSX.Element => {
	return <Sidebar>{ children }</Sidebar>;
};

export default FrontendBlock;
