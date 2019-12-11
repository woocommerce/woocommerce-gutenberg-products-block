<?php
/**
 * Controller Tests.
 *
 * @package WooCommerce\Blocks\Tests
 */

namespace Automattic\WooCommerce\Blocks\Tests\RestApi\StoreApi\Controllers;

use \WP_REST_Request;
use \WC_REST_Unit_Test_Case as TestCase;
use \WC_Helper_Product as ProductHelper;

/**
 * Cart Controller Tests.
 */
class Cart extends TestCase {
	/**
	 * Setup test products data. Called before every test.
	 */
	public function setUp() {
		parent::setUp();

		wp_set_current_user( 0 );

		update_option( 'woocommerce_weight_unit', 'g' );

		$this->products = [];

		// Create some test products.
		$this->products[0] = ProductHelper::create_simple_product( false );
		$this->products[0]->set_weight( 10 );
		$this->products[0]->set_regular_price( 10 );
		$this->products[0]->save();

		$this->products[1] = ProductHelper::create_simple_product( false );
		$this->products[1]->set_weight( 10 );
		$this->products[1]->set_regular_price( 10 );
		$this->products[1]->save();

		wc_empty_cart();

		$this->keys = [];
		$this->keys[] = wc()->cart->add_to_cart( $this->products[0]->get_id(), 2 );
		$this->keys[] = wc()->cart->add_to_cart( $this->products[1]->get_id(), 1 );
	}

	/**
	 * Test route registration.
	 */
	public function test_register_routes() {
		$routes = $this->server->get_routes();
		$this->assertArrayHasKey( '/wc/store/cart', $routes );
	}

	/**
	 * Test getting cart.
	 */
	public function test_get_item() {
		$response = $this->server->dispatch( new WP_REST_Request( 'GET', '/wc/store/cart' ) );
		$data     = $response->get_data();

		$this->assertEquals( 200, $response->get_status() );
		$this->assertEquals( 'GBP', $data['currency'] );
		$this->assertEquals( 3, $data['items_count'] );
		$this->assertEquals( 2, count( $data['items'] ) );
		$this->assertEquals( false, $data['needs_shipping'] );
		$this->assertEquals( '30', $data['items_weight'] );

		$this->assertEquals( '30.00', $data['total_items'] );
		$this->assertEquals( '0', $data['total_items_tax'] );
		$this->assertEquals( '0', $data['total_fees'] );
		$this->assertEquals( '0', $data['total_fees_tax'] );
		$this->assertEquals( '0', $data['total_discount'] );
		$this->assertEquals( '0', $data['total_discount_tax'] );
		$this->assertEquals( '0', $data['total_shipping'] );
		$this->assertEquals( '0', $data['total_shipping_tax'] );
		$this->assertEquals( '0', $data['total_tax'] );
		$this->assertEquals( '30.00', $data['total_price'] );
	}

	/**
	 * Test schema retrieval.
	 */
	public function test_get_item_schema() {
		$controller = new \Automattic\WooCommerce\Blocks\RestApi\StoreApi\Controllers\Cart();
		$schema     = $controller->get_item_schema();

		$this->assertArrayHasKey( 'currency', $schema['properties'] );
		$this->assertArrayHasKey( 'items_count', $schema['properties'] );
		$this->assertArrayHasKey( 'items', $schema['properties'] );
		$this->assertArrayHasKey( 'needs_shipping', $schema['properties'] );
		$this->assertArrayHasKey( 'items_weight', $schema['properties'] );
		$this->assertArrayHasKey( 'total_items', $schema['properties'] );
		$this->assertArrayHasKey( 'total_items_tax', $schema['properties'] );
		$this->assertArrayHasKey( 'total_fees', $schema['properties'] );
		$this->assertArrayHasKey( 'total_fees_tax', $schema['properties'] );
		$this->assertArrayHasKey( 'total_discount', $schema['properties'] );
		$this->assertArrayHasKey( 'total_discount_tax', $schema['properties'] );
		$this->assertArrayHasKey( 'total_shipping', $schema['properties'] );
		$this->assertArrayHasKey( 'total_shipping_tax', $schema['properties'] );
		$this->assertArrayHasKey( 'total_tax', $schema['properties'] );
		$this->assertArrayHasKey( 'total_price', $schema['properties'] );
		$this->assertArrayHasKey( 'tax_lines', $schema['properties'] );
	}

	/**
	 * Test conversion of cart item to rest response.
	 */
	public function test_prepare_item_for_response() {
		$controller = new \Automattic\WooCommerce\Blocks\RestApi\StoreApi\Controllers\Cart();
		$cart       = wc()->cart;
		$response   = $controller->prepare_item_for_response( $cart, [] );

		$this->assertArrayHasKey( 'currency', $response->get_data() );
		$this->assertArrayHasKey( 'items_count', $response->get_data() );
		$this->assertArrayHasKey( 'items', $response->get_data() );
		$this->assertArrayHasKey( 'needs_shipping', $response->get_data() );
		$this->assertArrayHasKey( 'items_weight', $response->get_data() );
		$this->assertArrayHasKey( 'total_items', $response->get_data() );
		$this->assertArrayHasKey( 'total_items_tax', $response->get_data() );
		$this->assertArrayHasKey( 'total_fees', $response->get_data() );
		$this->assertArrayHasKey( 'total_fees_tax', $response->get_data() );
		$this->assertArrayHasKey( 'total_discount', $response->get_data() );
		$this->assertArrayHasKey( 'total_discount_tax', $response->get_data() );
		$this->assertArrayHasKey( 'total_shipping', $response->get_data() );
		$this->assertArrayHasKey( 'total_shipping_tax', $response->get_data() );
		$this->assertArrayHasKey( 'total_tax', $response->get_data() );
		$this->assertArrayHasKey( 'total_price', $response->get_data() );
		$this->assertArrayHasKey( 'tax_lines', $response->get_data() );
	}
}
