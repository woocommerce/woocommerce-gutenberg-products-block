/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { Guide } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { createInterpolateElement, useEffect } from 'wordpress-element';

/**
 * Internal dependencies
 */
import WooImage from './woo-image';

const useLocalStorageState = ( key, initialState = '' ) => {
	const [ state, setState ] = useState( () => {
		const valueInLocalStorage = window.localStorage.getItem( key );
		return valueInLocalStorage
			? JSON.parse( valueInLocalStorage )
			: initialState;
	} );
	useEffect( () => {
		window.localStorage.setItem( key, JSON.stringify( state ) || '' );
	}, [ key, state ] );
	return [ state, setState ];
};

export default function CompatibilityNotice( { blockName } ) {
	const [ isOpen, setIsOpen ] = useLocalStorageState(
		`wc-blocks_${ blockName }_compatibility_notice`,
		true
	);
	if ( ! isOpen ) {
		return null;
	}

	return (
		<Guide
			className="edit-post-welcome-guide"
			contentLabel={ __(
				'Compatibility notice',
				'woo-gutenberg-products-block'
			) }
			onFinish={ () => setIsOpen( false ) }
			finishButtonText={ __( 'Got it!', 'woo-gutenberg-products-block' ) }
			pages={ [
				{
					image: <WooImage />,
					content: (
						<>
							<h1 className="edit-post-welcome-guide__heading">
								{ __(
									'Compatibility notice',
									'woo-gutenberg-products-block'
								) }
							</h1>
							<p className="edit-post-welcome-guide__text">
								{ createInterpolateElement(
									__(
										'<b>This block is in beta</b> and may not be compatible with all checkout extensions and integrations.<br />We recommend reviewing our <a>expanding list</a> of compatible extensions prior to using this block on a live store. Thanks for checkout out the beta.',
										'woo-gutenberg-products-block'
									),
									{
										a: (
											// eslint-disable-next-line jsx-a11y/anchor-has-content
											<a
												href="https://woocommerce.com"
												target="_blank"
												rel="noopener noreferrer"
											/>
										),
										b: <b />,
										br: <br />,
									}
								) }
							</p>
						</>
					),
				},
			] }
		/>
	);
}
