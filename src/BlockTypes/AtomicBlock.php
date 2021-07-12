<?php
namespace Automattic\WooCommerce\Blocks\BlockTypes;

/**
 * AtomicBlock class.
 *
 * @internal
 */
class AtomicBlock extends AbstractBlock {
	/**
	 * Inject attributes and block name.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content    Block content.
	 * @return string Rendered block type output.
	 */
	protected function render( $attributes, $content ) {
		return $this->inject_html_data_attributes( $content, $attributes );
	}

	/**
	 * Registers the block type with WordPress.
	 *
	 * @todo provides_context and uses_context differ from block to block. Defining them here does no harm but it would
	 * be better to register these only for the atomic blocks needing them.
	 */
	protected function register_block_type() {
		register_block_type(
			$this->get_block_type(),
			array(
				'render_callback'  => $this->get_block_type_render_callback(),
				'editor_script'    => $this->get_block_type_editor_script( 'handle' ),
				'editor_style'     => $this->get_block_type_editor_style(),
				'style'            => $this->get_block_type_style(),
				'attributes'       => $this->get_block_type_attributes(),
				'supports'         => $this->get_block_type_supports(),
				'provides_context' => [
					'woocommerce/showCompanyField'    => 'showCompanyField',
					'woocommerce/requireCompanyField' => 'requireCompanyField',
					'woocommerce/showApartmentField'  => 'showApartmentField',
					'woocommerce/showPhoneField'      => 'showPhoneField',
					'woocommerce/requirePhoneField'   => 'requirePhoneField',
				],
				'uses_context'     => [
					'woocommerce/showCompanyField',
					'woocommerce/requireCompanyField',
					'woocommerce/showApartmentField',
					'woocommerce/showPhoneField',
					'woocommerce/requirePhoneField',
				],
			)
		);
	}

	/**
	 * Get the editor script data for this block type.
	 *
	 * @param string $key Data to get, or default to everything.
	 * @return null
	 */
	protected function get_block_type_editor_script( $key = null ) {
		return null;
	}

	/**
	 * Get the editor style handle for this block type.
	 *
	 * @return null
	 */
	protected function get_block_type_editor_style() {
		return null;
	}

	/**
	 * Get the frontend script handle for this block type.
	 *
	 * @param string $key Data to get, or default to everything.
	 * @return null
	 */
	protected function get_block_type_script( $key = null ) {
		return null;
	}

	/**
	 * Get the frontend style handle for this block type.
	 *
	 * @return null
	 */
	protected function get_block_type_style() {
		return null;
	}

	/**
	 * Converts block attributes to HTML data attributes.
	 *
	 * @param array $attributes Key value pairs of attributes.
	 * @return string Rendered HTML attributes.
	 */
	protected function get_html_data_attributes( array $attributes ) {
		$data = parent::get_html_data_attributes( $attributes );
		return trim( $data . ' data-block-name="' . esc_attr( $this->namespace . '/' . $this->block_name ) . '"' );
	}
}
