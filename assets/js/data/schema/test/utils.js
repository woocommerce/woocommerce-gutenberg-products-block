/**
 * Internal dependencies
 */
import {
	extractModelNameFromRoute,
	getRouteIds,
	simplifyRouteWithId,
} from '../utils';

describe( 'extractModelNameFromRoute', () => {
	it.each`
		namespace      | route                                                                          | expected
		${'wc/blocks'} | ${'wc/blocks/products'}                                                        | ${'products'}
		${'wc/other'}  | ${'wc/blocks/product'}                                                         | ${'wc/blocks/product'}
		${'wc/blocks'} | ${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)'}                    | ${'products/attributes'}
		${'wc/blocks'} | ${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms'}              | ${'products/attributes/terms'}
		${'wc/blocks'} | ${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms/(?P<id>[d]+)'} | ${'products/attributes/terms'}
		${'wc/blocks'} | ${'wc/blocks/cart/(?P<id>[\\s]+)'}                                             | ${'cart'}
	`(
		'returns "$expected" when namespace is "$namespace" and route is "$route"',
		( { namespace, route, expected } ) => {
			expect( extractModelNameFromRoute( namespace, route ) ).toBe(
				expected
			);
		}
	);
} );

describe( 'getRouteIds', () => {
	it.each`
		route                                                                            | expected
		${'wc/blocks/products'}                                                          | ${[]}
		${'wc/blocks/products/(?P<id>[\\d]+)'}                                           | ${[ 'id' ]}
		${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms/(?P<id>[\\d]+)'} | ${[ 'attribute_id', 'id' ]}
	`(
		'returns "$expected" when route is "$route"',
		( { route, expected } ) => {
			expect( getRouteIds( route ) ).toEqual( expected );
		}
	);
} );

describe( 'simplifyRouteWithId', () => {
	it.each`
		route                                                                            | matchIds                    | expected
		${'wc/blocks/products'}                                                          | ${[]}                       | ${'wc/blocks/products'}
		${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)'}                      | ${[ 'attribute_id' ]}       | ${'wc/blocks/products/attributes/{attribute_id}'}
		${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms'}                | ${[ 'attribute_id' ]}       | ${'wc/blocks/products/attributes/{attribute_id}/terms'}
		${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms/(?P<id>[\\d]+)'} | ${[ 'attribute_id', 'id' ]} | ${'wc/blocks/products/attributes/{attribute_id}/terms/{id}'}
		${'wc/blocks/products/attributes/(?P<attribute_id>[\\d]+)/terms/(?P<id>[\\d]+)'} | ${[ 'id', 'attribute_id' ]} | ${'wc/blocks/products/attributes/{attribute_id}/terms/{id}'}
		${'wc/blocks/cart/(?P<id>[\\s]+)'}                                               | ${[ 'id' ]}                 | ${'wc/blocks/cart/{id}'}
		${'wc/blocks/cart/(?P<id>[\\s]+)'}                                               | ${[ 'attribute_id' ]}       | ${'wc/blocks/cart/(?P<id>[\\s]+)'}
	`(
		'returns "$expected" when route is "$route" and matchIds is "$matchIds"',
		( { route, matchIds, expected } ) => {
			expect( simplifyRouteWithId( route, matchIds ) ).toBe( expected );
		}
	);
} );
