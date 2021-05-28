/**
 * External dependencies
 */
import { Main } from '@woocommerce/base-components/sidebar-layout';

const FrontendBlock = ( {
	children,
}: {
	children: JSX.Element;
} ): JSX.Element => {
	return <Main>{ children }</Main>;
};

export default FrontendBlock;
