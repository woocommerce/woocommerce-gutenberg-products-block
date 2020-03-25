/**
 * External dependencies
 */
import { useCallback } from 'react';
import { select } from '@wordpress/data';

// Stand-in wcTracks.recordEvent in case tracks is not available (for any reason).
window.wcTracks = window.wcTracks || {};
window.wcTracks.recordEvent = window.wcTracks.recordEvent || function() {};

export const selectPostInfoProps = () => {
	const postData = select( 'core/editor' );
	return {
		post_id: postData.getCurrentPostId(),
		post_type: postData.getCurrentPostType(),
	};
};

/**
 * Hook for sending usage tracks events from a component.
 *
 * @param {string}   event Event name.
 * @param {Function} propsCallback Callback function for adding props.
 * @return {Function} Custom function to call for recording the specified event.
 */
export const useTracksEvent = ( event, propsCallback ) => {
	const recordEvent = useCallback(
		( props ) => {
			let eventProps = props;
			if ( typeof propsCallback === 'function' ) {
				eventProps = {
					...props,
					...propsCallback(),
				};
			}
			window.wcTracks.recordEvent( `blocks_${ event }`, eventProps );
		},
		[ event, propsCallback ]
	);
	return recordEvent;
};
