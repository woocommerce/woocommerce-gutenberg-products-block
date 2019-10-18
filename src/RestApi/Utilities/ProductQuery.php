<?php
/**
 * Helper class to handle product queries for the API.
 *
 * @package WooCommerce/Blocks
 */

namespace Automattic\WooCommerce\Blocks\RestApi\Utilities;

defined( 'ABSPATH' ) || exit;

/**
 * Product Query class.
 */
class ProductQuery {
	/**
	 * Prepare query args to pass to WP_Query for a REST API request.
	 *
	 * @param \WP_REST_Request $request Request data.
	 * @return array
	 */
	public function prepare_objects_query( $request ) {
		$args                        = array();
		$args['offset']              = $request['offset'];
		$args['order']               = $request['order'];
		$args['orderby']             = $request['orderby'];
		$args['paged']               = $request['page'];
		$args['post__in']            = $request['include'];
		$args['post__not_in']        = $request['exclude'];
		$args['posts_per_page']      = $request['per_page'];
		$args['name']                = $request['slug'];
		$args['post_parent__in']     = $request['parent'];
		$args['post_parent__not_in'] = $request['parent_exclude'];
		$args['s']                   = $request['search'];
		$args['fields']              = 'ids';
		$args['ignore_sticky_posts'] = true;

		if ( 'date' === $args['orderby'] ) {
			$args['orderby'] = 'date ID';
		}

		$args['date_query'] = array();

		// Set before into date query. Date query must be specified as an array of an array.
		if ( isset( $request['before'] ) ) {
			$args['date_query'][0]['before'] = $request['before'];
		}

		// Set after into date query. Date query must be specified as an array of an array.
		if ( isset( $request['after'] ) ) {
			$args['date_query'][0]['after'] = $request['after'];
		}

		// Set date query colummn. Defaults to post_date.
		if ( isset( $request['date_column'] ) && ! empty( $args['date_query'][0] ) ) {
			$args['date_query'][0]['column'] = 'post_' . $request['date_column'];
		}

		// Set post_status.
		$args['post_status'] = $request['status'];

		// Set custom args to handle later during clauses.
		$custom_keys = array(
			'sku',
			'min_price',
			'max_price',
			'stock_status',
			'low_in_stock',
		);

		foreach ( $custom_keys as $key ) {
			if ( ! empty( $request[ $key ] ) ) {
				$args[ $key ] = $request[ $key ];
			}
		}

		// Taxonomy query to filter products by type, category,
		// tag, shipping class, and attribute.
		$tax_query = array();

		// Map between taxonomy name and arg's key.
		$taxonomies = array(
			'product_cat'            => 'category',
			'product_tag'            => 'tag',
			'product_shipping_class' => 'shipping_class',
		);

		// Set tax_query for each passed arg.
		foreach ( $taxonomies as $taxonomy => $key ) {
			if ( ! empty( $request[ $key ] ) ) {
				$tax_query[] = array(
					'taxonomy' => $taxonomy,
					'field'    => 'term_id',
					'terms'    => $request[ $key ],
				);
			}
		}

		// Filter product type by slug.
		if ( ! empty( $request['type'] ) ) {
			$tax_query[] = array(
				'taxonomy' => 'product_type',
				'field'    => 'slug',
				'terms'    => $request['type'],
			);
		}

		// Filter by attribute and term.
		if ( ! empty( $request['attribute'] ) && ! empty( $request['attribute_term'] ) ) {
			if ( in_array( $request['attribute'], wc_get_attribute_taxonomy_names(), true ) ) {
				$tax_query[] = array(
					'taxonomy' => $request['attribute'],
					'field'    => 'term_id',
					'terms'    => $request['attribute_term'],
				);
			}
		}

		// Build tax_query if taxonomies are set.
		if ( ! empty( $tax_query ) ) {
			if ( ! empty( $args['tax_query'] ) ) {
				$args['tax_query'] = array_merge( $tax_query, $args['tax_query'] ); // phpcs:ignore
			} else {
				$args['tax_query'] = $tax_query; // phpcs:ignore
			}
		}

		// Filter featured.
		if ( is_bool( $request['featured'] ) ) {
			$args['tax_query'][] = array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => 'featured',
				'operator' => true === $request['featured'] ? 'IN' : 'NOT IN',
			);
		}

		// Filter by tax class.
		if ( ! empty( $request['tax_class'] ) ) {
			$args['meta_query'] = $this->add_meta_query( // phpcs:ignore
				$args,
				array(
					'key'   => '_tax_class',
					'value' => 'standard' !== $request['tax_class'] ? $request['tax_class'] : '',
				)
			);
		}

		// Filter by on sale products.
		if ( is_bool( $request['on_sale'] ) ) {
			$on_sale_key = $request['on_sale'] ? 'post__in' : 'post__not_in';
			$on_sale_ids = wc_get_product_ids_on_sale();

			// Use 0 when there's no on sale products to avoid return all products.
			$on_sale_ids = empty( $on_sale_ids ) ? array( 0 ) : $on_sale_ids;

			$args[ $on_sale_key ] += $on_sale_ids;
		}

		$operator_mapping = array(
			'in'     => 'IN',
			'not_in' => 'NOT IN',
			'and'    => 'AND',
		);

		$category_operator  = $operator_mapping[ $request->get_param( 'category_operator' ) ];
		$tag_operator       = $operator_mapping[ $request->get_param( 'tag_operator' ) ];
		$attribute_operator = $operator_mapping[ $request->get_param( 'attribute_operator' ) ];

		if ( $category_operator && isset( $args['tax_query'] ) ) {
			foreach ( $args['tax_query'] as $i => $tax_query ) {
				if ( 'product_cat' === $tax_query['taxonomy'] ) {
					$args['tax_query'][ $i ]['operator']         = $category_operator;
					$args['tax_query'][ $i ]['include_children'] = 'AND' === $category_operator ? false : true;
				}
			}
		}

		if ( $tag_operator && isset( $args['tax_query'] ) ) {
			foreach ( $args['tax_query'] as $i => $tax_query ) {
				if ( 'product_tag' === $tax_query['taxonomy'] ) {
					$args['tax_query'][ $i ]['operator'] = $tag_operator;
				}
			}
		}

		if ( $attribute_operator && isset( $args['tax_query'] ) ) {
			foreach ( $args['tax_query'] as $i => $tax_query ) {
				if ( in_array( $tax_query['taxonomy'], wc_get_attribute_taxonomy_names(), true ) ) {
					$args['tax_query'][ $i ]['operator'] = $attribute_operator;
				}
			}
		}

		$catalog_visibility = $request->get_param( 'catalog_visibility' );
		$rating             = $request->get_param( 'rating' );
		$visibility_options = wc_get_product_visibility_options();

		if ( in_array( $catalog_visibility, array_keys( $visibility_options ), true ) ) {
			$exclude_from_catalog = 'search' === $catalog_visibility ? '' : 'exclude-from-catalog';
			$exclude_from_search  = 'catalog' === $catalog_visibility ? '' : 'exclude-from-search';

			$args['tax_query'][] = array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => array( $exclude_from_catalog, $exclude_from_search ),
				'operator' => 'hidden' === $catalog_visibility ? 'AND' : 'NOT IN',
			);
		}

		if ( $rating ) {
			$rating_terms = [];
			foreach ( $rating as $value ) {
				$rating_terms[] = 'rated-' . $value;
			}
			$args['tax_query'][] = array(
				'taxonomy' => 'product_visibility',
				'field'    => 'name',
				'terms'    => $rating_terms,
			);
		}

		// Force the post_type argument, since it's not a user input variable.
		if ( ! empty( $request['sku'] ) ) {
			$args['post_type'] = array( 'product', 'product_variation' );
		} else {
			$args['post_type'] = 'product';
		}

		$orderby = $request->get_param( 'orderby' );
		$order   = $request->get_param( 'order' );

		$ordering_args   = WC()->query->get_catalog_ordering_args( $orderby, $order );
		$args['orderby'] = $ordering_args['orderby'];
		$args['order']   = $ordering_args['order'];

		if ( 'include' === $orderby ) {
			$args['orderby'] = 'post__in';
		} elseif ( 'id' === $orderby ) {
			$args['orderby'] = 'ID'; // ID must be capitalized.
		} elseif ( 'slug' === $orderby ) {
			$args['orderby'] = 'name';
		}

		if ( $ordering_args['meta_key'] ) {
			$args['meta_key'] = $ordering_args['meta_key']; // phpcs:ignore
		}

		return $args;
	}

	/**
	 * Get objects.
	 *
	 * @param \WP_REST_Request $request Request data.
	 * @return array
	 */
	public function get_objects( $request ) {
		$query_args = $this->prepare_objects_query( $request );

		add_filter( 'posts_clauses', array( $this, 'add_query_clauses' ), 10, 2 );

		$query       = new \WP_Query();
		$result      = $query->query( $query_args );
		$total_posts = $query->found_posts;

		// Out-of-bounds, run the query again without LIMIT for total count.
		if ( $total_posts < 1 ) {
			unset( $query_args['paged'] );
			$count_query = new \WP_Query();
			$count_query->query( $query_args );
			$total_posts = $count_query->found_posts;
		}

		remove_filter( 'posts_clauses', array( $this, 'add_query_clauses' ), 10 );

		return array(
			'objects' => array_map( 'wc_get_product', $result ),
			'total'   => (int) $total_posts,
			'pages'   => (int) ceil( $total_posts / (int) $query->query_vars['posts_per_page'] ),
		);
	}

	/**
	 * Add in conditional search filters for products.
	 *
	 * @param array     $args Query args.
	 * @param \WC_Query $wp_query WC_Query object.
	 * @return array
	 */
	public function add_query_clauses( $args, $wp_query ) {
		global $wpdb;

		if ( $wp_query->get( 'search' ) ) {
			$search         = "'%" . $wpdb->esc_like( $wp_query->get( 'search' ) ) . "%'";
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= " AND ({$wpdb->posts}.post_title LIKE {$search}";
			$args['where'] .= wc_product_sku_enabled() ? ' OR wc_product_meta_lookup.sku LIKE ' . $search . ')' : ')';
		}

		if ( $wp_query->get( 'sku' ) ) {
			$skus = explode( ',', $wp_query->get( 'sku' ) );
			// Include the current string as a SKU too.
			if ( 1 < count( $skus ) ) {
				$skus[] = $wp_query->get( 'sku' );
			}
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= ' AND wc_product_meta_lookup.sku IN ("' . implode( '","', array_map( 'esc_sql', $skus ) ) . '")';
		}

		if ( $wp_query->get( 'min_price' ) ) {
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= $wpdb->prepare( ' AND wc_product_meta_lookup.min_price >= %f ', floatval( $wp_query->get( 'min_price' ) ) );
		}

		if ( $wp_query->get( 'max_price' ) ) {
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= $wpdb->prepare( ' AND wc_product_meta_lookup.max_price <= %f ', floatval( $wp_query->get( 'max_price' ) ) );
		}

		if ( $wp_query->get( 'stock_status' ) ) {
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= $wpdb->prepare( ' AND wc_product_meta_lookup.stock_status = %s ', $wp_query->get( 'stock_status' ) );
		}

		if ( $wp_query->get( 'low_in_stock' ) ) {
			$low_stock      = absint( max( get_option( 'woocommerce_notify_low_stock_amount' ), 1 ) );
			$args['join']   = $this->append_product_sorting_table_join( $args['join'] );
			$args['where'] .= $wpdb->prepare( ' AND wc_product_meta_lookup.stock_quantity <= %d', $low_stock );
		}

		return $args;
	}

	/**
	 * Add meta query.
	 *
	 * @param array $args       Query args.
	 * @param array $meta_query Meta query.
	 * @return array
	 */
	protected function add_meta_query( $args, $meta_query ) {
		if ( empty( $args['meta_query'] ) ) {
			$args['meta_query'] = []; // phpcs:ignore
		}

		$args['meta_query'][] = $meta_query;

		return $args['meta_query'];
	}

	/**
	 * Join wc_product_meta_lookup to posts if not already joined.
	 *
	 * @param string $sql SQL join.
	 * @return string
	 */
	protected function append_product_sorting_table_join( $sql ) {
		global $wpdb;

		if ( ! strstr( $sql, 'wc_product_meta_lookup' ) ) {
			$sql .= " LEFT JOIN {$wpdb->wc_product_meta_lookup} wc_product_meta_lookup ON $wpdb->posts.ID = wc_product_meta_lookup.product_id ";
		}
		return $sql;
	}
}
