<?php
/**
 * Display the featured product block in the content.
 *
 * @package WooCommerce\Blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Wrapper class for Featured Product callback.
 */
class WC_Block_Featured_Product {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected static $block_name = 'featured-product';

	/**
	 * Default attribute values, should match what's set in JS `registerBlockType`.
	 *
	 * @var array
	 */
	protected static $defaults = array(
		'align'        => 'none',
		'contentAlign' => 'center',
		'dimRatio'     => 50,
		'showDesc'     => true,
		'showPrice'    => true,
	);

	/**
	 * Render the Featured Product block.
	 *
	 * @param array  $attributes Block attributes. Default empty array.
	 * @param string $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	public static function render( $attributes, $content ) {
		$id      = (int) $attributes['productId'];
		$product = wc_get_product( $id );
		if ( ! $product ) {
			return '';
		}
		$attributes = wp_parse_args( $attributes, self::$defaults );

		$title = sprintf(
			'<h2 class="wc-block-featured-product__title">%s</h2>',
			esc_html( $product->get_title() )
		);

		$desc_str = sprintf(
			'<div class="wc-block-featured-product__description">%s</div>',
			apply_filters( 'woocommerce_short_description', $product->get_short_description() )
		);

		$price_str = sprintf(
			'<div class="wc-block-featured-product__price">%s</div>',
			$product->get_price_html()
		);

		$output = sprintf( '<div class="%1$s" style="%2$s">', self::get_classes( $attributes ), self::get_styles( $attributes, $product ) );

		$output .= $title;
		if ( $attributes['showDesc'] ) {
			$output .= $desc_str;
		}
		if ( $attributes['showPrice'] ) {
			$output .= $price_str;
		}
		$output .= '</div>';

		return $output;
	}

	/**
	 * Get the styles for the wrapper element (background image, color).
	 *
	 * @param array      $attributes Block attributes. Default empty array.
	 * @param WC_Product $product Product object.
	 * @return string
	 */
	public static function get_styles( $attributes, $product ) {
		$image = self::get_image( $product, ( 'none' !== $attributes['align'] ) ? 'large' : 'full' );
		$style = sprintf( 'background-image:url(%s);', esc_url( $image ) );

		if ( isset( $attributes['customOverlayColor'] ) ) {
			$style .= sprintf( 'background-color:%s;', esc_attr( $attributes['customOverlayColor'] ) );
		}

		return $style;
	}

	/**
	 * Get class names for the block container.
	 *
	 * @param array $attributes Block attributes. Default empty array.
	 * @return string
	 */
	public static function get_classes( $attributes ) {
		$classes = array( 'wc-block-' . self::$block_name );

		if ( isset( $attributes['align'] ) ) {
			$classes[] = "align{$attributes['align']}";
		}

		if ( isset( $attributes['dimRatio'] ) && ( 0 !== $attributes['dimRatio'] ) ) {
			$classes[] = 'has-background-dim';

			if ( 50 !== $attributes['dimRatio'] ) {
				$classes[] = 'has-background-dim-' . 10 * round( $attributes['dimRatio'] / 10 );
			}
		}

		if ( isset( $attributes['contentAlign'] ) && 'center' !== $attributes['contentAlign'] ) {
			$classes[] = "has-{$attributes['contentAlign']}-content";
		}

		if ( isset( $attributes['overlayColor'] ) ) {
			$classes[] = "has-{$attributes['overlayColor']}-background-color";
		}

		return implode( $classes, ' ' );
	}

	/**
	 * Returns the main product image URL.
	 *
	 * @param WC_Product $product Product object.
	 * @param string     $size    Image size, defaults to 'full'.
	 * @return string
	 */
	public static function get_image( $product, $size = 'full' ) {
		$image = '';
		if ( $product->get_image_id() ) {
			$image = wp_get_attachment_image_url( $product->get_image_id(), $size );
		} elseif ( $product->get_parent_id() ) {
			$parent_product = wc_get_product( $product->get_parent_id() );
			if ( $parent_product ) {
				$image = wp_get_attachment_image_url( $parent_product->get_image_id(), $size );
			}
		}

		return $image;
	}
}
