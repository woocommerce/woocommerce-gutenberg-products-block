<?php
/**
 * Product categories block.
 *
 * @package WooCommerce/Blocks
 */

namespace Automattic\WooCommerce\Blocks\BlockTypes;

defined( 'ABSPATH' ) || exit;

/**
 * ProductCategories class.
 */
class ProductCategories extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'product-categories';

	/**
	 * Registers the block type with WordPress.
	 */
	public function register_block_type() {
		register_block_type(
			$this->namespace . '/' . $this->block_name,
			array(
				'render_callback' => array( $this, 'render' ),
				'editor_script'   => 'wc-' . $this->block_name,
				'editor_style'    => 'wc-block-editor',
				'style'           => 'wc-block-style',
				'script'          => 'wc-' . $this->block_name . '-frontend',
			)
		);
	}

	/**
	 * Append frontend scripts when rendering the Product Categories List block.
	 *
	 * @param array  $attributes Block attributes. Default empty array.
	 * @param string $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	public function render( $attributes = array(), $content = '' ) {
		\Automattic\WooCommerce\Blocks\Assets::register_block_script( $this->block_name . '-frontend' );

		// Note, this is temporary - these dependencies will be injected in the near future.
		$data_registry = wc_blocks_container()->get(
			\Automattic\WooCommerce\Blocks\Assets\AssetDataRegistry::class
		);

		$data_registry->add( 'productCategories', $this->get_category_objects() );

		return $content;
	}

	/**
	 * Get all product category terms so the block has content to render.
	 *
	 * @return array Array of category objects.
	 */
	protected function get_category_objects() {
		$product_categories = get_terms(
			'product_cat',
			array(
				'hide_empty' => false,
				'pad_counts' => true,
			)
		);
		foreach ( $product_categories as &$category ) {
			$category->link = get_term_link( $category->term_id, 'product_cat' );
		}
		return $product_categories;
	}
}
