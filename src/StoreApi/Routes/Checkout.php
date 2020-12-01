<?php
namespace Automattic\WooCommerce\Blocks\StoreApi\Routes;

use \Exception;
use Automattic\WooCommerce\Blocks\Package;
use Automattic\WooCommerce\Blocks\Domain\Services\CreateAccount;
use Automattic\WooCommerce\Blocks\StoreApi\Utilities\CartController;
use Automattic\WooCommerce\Blocks\StoreApi\Utilities\OrderController;
use Automattic\WooCommerce\Blocks\StoreApi\Utilities\ReserveStock;
use Automattic\WooCommerce\Blocks\StoreApi\Utilities\ReserveStockException;
use Automattic\WooCommerce\Blocks\Payments\PaymentResult;
use Automattic\WooCommerce\Blocks\Payments\PaymentContext;

/**
 * Checkout class.
 *
 * @internal This API is used internally by Blocks--it is still in flux and may be subject to revisions.
 */
class Checkout extends AbstractRoute {
	/**
	 * Get the path of this REST route.
	 *
	 * @return string
	 */
	public function get_path() {
		return '/checkout';
	}

	/**
	 * Enforce nonces for all checkout endpoints.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get_response( \WP_REST_Request $request ) {
		$this->maybe_load_cart();
		$response = null;
		try {
			$this->check_nonce( $request );
			$response = parent::get_response( $request );
		} catch ( RouteException $error ) {
			$response = $this->get_route_error_response( $error->getErrorCode(), $error->getMessage(), $error->getCode() );
		} catch ( \Exception $error ) {
			$response = $this->get_route_error_response( 'unknown_server_error', $error->getMessage(), 500 );
		}
		return $response;
	}

	/**
	 * Get method arguments for this REST route.
	 *
	 * @return array An array of endpoints.
	 */
	public function get_args() {
		return [
			[
				'methods'             => \WP_REST_Server::READABLE,
				'callback'            => [ $this, 'get_response' ],
				'permission_callback' => '__return_true',
				'args'                => [
					'context' => $this->get_context_param( [ 'default' => 'view' ] ),
				],
			],
			[
				'methods'             => \WP_REST_Server::EDITABLE,
				'callback'            => array( $this, 'get_response' ),
				'permission_callback' => '__return_true',
				'args'                => $this->schema->get_endpoint_args_for_item_schema( \WP_REST_Server::EDITABLE ),
			],
			[
				'methods'             => \WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'get_response' ],
				'permission_callback' => '__return_true',
				'args'                => array_merge(
					[
						'payment_data' => [
							'description' => __( 'Data to pass through to the payment method when processing payment.', 'woo-gutenberg-products-block' ),
							'type'        => 'array',
							'items'       => [
								'type'       => 'object',
								'properties' => [
									'key'   => [
										'type' => 'string',
									],
									'value' => [
										'type' => 'string',
									],
								],
							],
						],
					],
					$this->schema->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE )
				),
			],
			'schema' => [ $this->schema, 'get_public_item_schema' ],
		];
	}

	/**
	 * Convert the cart into a new draft order, or update an existing draft order, and return an updated cart response.
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	protected function get_route_response( \WP_REST_Request $request ) {
		$order_object = $this->create_or_update_draft_order();

		return $this->prepare_item_for_response(
			(object) [
				'order'          => $order_object,
				'payment_result' => new PaymentResult(),
			],
			$request
		);
	}

	/**
	 * Update the order.
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	protected function get_route_update_response( \WP_REST_Request $request ) {
		// Update customer first since orders will be created using that data.
		$this->update_customer_from_request( $request );

		$order_object = $this->create_or_update_draft_order();
		$this->update_order_from_request( $order_object, $request );

		return $this->prepare_item_for_response(
			(object) [
				'order'          => $order_object,
				'payment_result' => new PaymentResult(),
			],
			$request
		);
	}

	/**
	 * Update and process an order.
	 *
	 * 1. Obtain Draft Order
	 * 2. Process Request
	 * 3. Process Customer
	 * 4. Validate Order
	 * 5. Process Payment
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response
	 */
	protected function get_route_post_response( \WP_REST_Request $request ) {
		// --
		// 1. Obtain Draft Order

		// Update customer first since orders will be created using that data.
		$this->update_customer_from_request( $request );

		// Get the order, including validation and reserving stock.
		$order = $this->create_or_update_draft_order();

		// --
		// 2. Process Request

		// If any form fields were posted, update the order (e.g. order note, payment method).
		$this->update_order_from_request( $order, $request );

		// Validate payment method before proceeding.
		if ( $order->needs_payment() && empty( $request['payment_method'] ) ) {
			throw new RouteException(
				'woocommerce_rest_checkout_missing_payment_method',
				__( 'No payment method provided.', 'woo-gutenberg-products-block' ),
				400
			);
		}

		// --
		// 3. Process Customer

		// Update order with customer details, and sign up a user account as necessary.
		$this->process_customer( $order, $request );

		// --
		// 4. Validate Order

		// Check order is still valid.
		$order_controller = new OrderController();
		$order_controller->validate_order_before_payment( $order );

		/*
		* Action: woocommerce_blocks_checkout_order_processed (experimental).
		* This hook informs extensions that $order has completed processing and is ready
		* for payment.
		*
		* This is similar to existing core hook woocommerce_checkout_order_processed.
		* We're using a new action:
		* - To keep the interface focused (only pass $order, not passing request data).
		* - This also explicitly indicates these orders are from checkout block/StoreAPI.
		*
		* Status: experimental; may change or be removed.
		* Introduced: WooCommerce Blocks 3.8.0.
		* https://github.com/woocommerce/woocommerce-gutenberg-products-block/pull/3238
		*/
		// Save the order so the param and database match (extensions may access DB).
		$order->save();
		do_action( '__experimental_woocommerce_blocks_checkout_order_processed', $order );

		// --
		// 5. Process Payment

		if ( ! $order->needs_payment() ) {
			$payment_result = $this->process_without_payment( $order, $request );
		} else {
			$payment_result = $this->process_payment( $order, $request );
		}

		// --
		// Generate response & return.

		$response = $this->prepare_item_for_response(
			(object) [
				'order'          => wc_get_order( $order ),
				'payment_result' => $payment_result,
			],
			$request
		);

		switch ( $payment_result->status ) {
			case 'success':
				$response->set_status( 200 );
				break;
			case 'pending':
				$response->set_status( 202 );
				break;
			case 'failure':
				$response->set_status( 400 );
				break;
			case 'error':
				$response->set_status( 500 );
				break;
		}

		return $response;
	}

	/**
	 * Get route response when something went wrong.
	 *
	 * @param string $error_code String based error code.
	 * @param string $error_message User facing error message.
	 * @param int    $http_status_code HTTP status. Defaults to 500.
	 * @param array  $additional_data  Extra data (key value pairs) to expose in the error response.
	 * @return \WP_Error WP Error object.
	 */
	protected function get_route_error_response( $error_code, $error_message, $http_status_code = 500, $additional_data = [] ) {
		// Return user ID with all errors. Checkout may create an account and log user in
		// (CreateAccount service). If there is an error elsewhere in checkout processing,
		// return the user id so the checkout UX can update where needed.
		// For example: out of stock, or coupon fails validation.
		$user_id = get_current_user_id();

		switch ( $http_status_code ) {
			case 409:
				// If there was a conflict, return the cart so the client can resolve it.
				$controller = new CartController();
				$cart       = $controller->get_cart_instance();

				return new \WP_Error(
					$error_code,
					$error_message,
					array_merge(
						$additional_data,
						[
							'status'  => $http_status_code,
							'cart'    => wc()->api->get_endpoint_data( '/wc/store/cart' ),
							'user_id' => $user_id,
						]
					)
				);
		}
		return new \WP_Error(
			$error_code,
			$error_message,
			[
				'status'  => $http_status_code,
				'user_id' => $user_id,
			]
		);
	}

	/**
	 * Gets draft order data from the customer session.
	 *
	 * @return array
	 */
	protected function get_draft_order_id() {
		return wc()->session->get( 'store_api_draft_order', 0 );
	}

	/**
	 * Updates draft order data in the customer session.
	 *
	 * @param integer $order_id Draft order ID.
	 */
	protected function set_draft_order_id( $order_id ) {
		wc()->session->set( 'store_api_draft_order', $order_id );
	}

	/**
	 * Whether the passed argument is a draft order or an order that is
	 * pending/failed and the cart hasn't changed.
	 *
	 * @param \WC_Order $order_object Order object to check.
	 * @return boolean Whether the order is valid as a draft order.
	 */
	protected function is_valid_draft_order( $order_object ) {
		if ( ! $order_object instanceof \WC_Order ) {
			return false;
		}

		// Draft orders are okay.
		if ( $order_object->has_status( 'checkout-draft' ) ) {
			return true;
		}

		// Pending and failed orders can be retried if the cart hasn't changed.
		if ( $order_object->needs_payment() && $order_object->has_cart_hash( wc()->cart->get_cart_hash() ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Get an order object, either using a current draft order, or returning a new one.
	 *
	 * @param integer $order_id Draft order ID.
	 * @return \WC_Order|boolean Either the draft order, or false if one has not yet been created.
	 */
	protected function get_draft_order_object( $order_id ) {
		// If order ID doesn't exist or it doesn't match a draft order, create
		// a new draft order. That might happen when trying to checkout directly
		// from the Cart block with an express payment method and the draft
		// order hasn't been created yet.
		$draft_order_object = $order_id ? wc_get_order( $order_id ) : false;

		return $this->is_valid_draft_order( $draft_order_object ) ? $draft_order_object : $this->create_or_update_draft_order();
	}

	/**
	 * Create or update a draft order based on the cart.
	 *
	 * @throws RouteException On error.
	 *
	 * @return \WC_Order Order object.
	 */
	protected function create_or_update_draft_order() {
		$cart_controller  = new CartController();
		$order_controller = new OrderController();
		$reserve_stock    = \class_exists( '\Automattic\WooCommerce\Checkout\Helpers\ReserveStock' ) ? new \Automattic\WooCommerce\Checkout\Helpers\ReserveStock() : new ReserveStock();
		$order_object     = $this->get_draft_order_id() ? wc_get_order( $this->get_draft_order_id() ) : null;
		$created          = false;

		// Validate items etc are allowed in the order before it gets created.
		$cart_controller->validate_cart_items();
		$cart_controller->validate_cart_coupons();

		if ( ! $this->is_valid_draft_order( $order_object ) ) {
			$order_object = $order_controller->create_order_from_cart();
			$created      = true;
		} else {
			$order_controller->update_order_from_cart( $order_object );
		}

		// Store order ID to session.
		$this->set_draft_order_id( $order_object->get_id() );

		// Try to reserve stock for 10 mins, if available.
		try {
			$reserve_stock->reserve_stock_for_order( $order_object, 10 );
		} catch ( ReserveStockException $e ) {
			$error_data = $e->getErrorData();
			throw new RouteException(
				$e->getErrorCode(),
				$e->getMessage(),
				$e->getCode()
			);
		}

		return $order_object;
	}

	/**
	 * Convert an account creation error to a Store API error.
	 *
	 * @param \Exception $error Caught exception.
	 *
	 * @throws RouteException API error object with error details.
	 */
	private function handle_error( Exception $error ) {
		switch ( $error->getMessage() ) {
			case 'registration-error-invalid-email':
				throw new RouteException(
					'registration-error-invalid-email',
					__( 'Please provide a valid email address.', 'woo-gutenberg-products-block' ),
					400
				);

			case 'registration-error-email-exists':
				throw new RouteException(
					'registration-error-email-exists',
					apply_filters(
						'woocommerce_registration_error_email_exists',
						__( 'An account is already registered with your email address. Please log in.', 'woo-gutenberg-products-block' )
					),
					400
				);
		}
	}

	/**
	 * Updates the current customer session using data from the request (e.g. address data).
	 *
	 * Address session data is synced to the order itself later on by OrderController::update_order_from_cart()
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 */
	protected function update_customer_from_request( \WP_REST_Request $request ) {
		$schema   = $this->get_item_schema();
		$customer = wc()->customer;

		if ( isset( $request['billing_address'] ) ) {
			$allowed_billing_values = array_intersect_key( $request['billing_address'], $schema['properties']['billing_address']['properties'] );
			foreach ( $allowed_billing_values as $key => $value ) {
				if ( is_callable( [ $customer, "set_billing_$key" ] ) ) {
					$customer->{"set_billing_$key"}( $value );
				}
			}
		}

		if ( isset( $request['shipping_address'] ) ) {
			$allowed_shipping_values = array_intersect_key( $request['shipping_address'], $schema['properties']['shipping_address']['properties'] );
			foreach ( $allowed_shipping_values as $key => $value ) {
				if ( is_callable( [ $customer, "set_shipping_$key" ] ) ) {
					$customer->{"set_shipping_$key"}( $value );
				}
			}
		}

		$customer->save();
	}

	/**
	 * Update an order using the posted values from the request.
	 *
	 * @param \WC_Order        $order Object to prepare for the response.
	 * @param \WP_REST_Request $request Full details about the request.
	 */
	protected function update_order_from_request( \WC_Order $order, \WP_REST_Request $request ) {
		if ( isset( $request['customer_note'] ) ) {
			$order->set_customer_note( $request['customer_note'] );
		}

		if ( isset( $request['payment_method'] ) ) {
			$order->set_payment_method( $this->get_request_payment_method( $request ) );
		}

		$order->save();
	}

	/**
	 * For orders which do not require payment, just update status.
	 *
	 * @param \WC_Order        $order Order object.
	 * @param \WP_REST_Request $request Request object.
	 * @return PaymentResult
	 */
	protected function process_without_payment( \WC_Order $order, \WP_REST_Request $request ) {
		$order->payment_complete();

		$result = new PaymentResult( 'success' );
		$result->set_redirect_url( $order->get_checkout_order_received_url() );
		return $result;
	}

	/**
	 * Fires an action hook instructing active payment gateways to process the payment for an order and provide a result.
	 *
	 * @throws RouteException On error.
	 * @param \WC_Order        $order Order object.
	 * @param \WP_REST_Request $request Request object.
	 * @return PaymentResult
	 */
	protected function process_payment( \WC_Order $order, \WP_REST_Request $request ) {
		$context = new PaymentContext();
		$result  = new PaymentResult();

		$order->update_status( 'pending' );

		$context->set_order( $order );
		$context->set_payment_method( $this->get_request_payment_method_id( $request ) );
		$context->set_payment_data( $this->get_request_payment_data( $request ) );

		try {
			/**
			 * Process payment with context.
			 *
			 * @hook woocommerce_rest_checkout_process_payment_with_context
			 *
			 * @throws \Exception If there is an error taking payment, an Exception object can be thrown
			 *                                     with an error message.
			 *
			 * @param PaymentContext $context Holds context for the payment, including order ID and payment method.
			 * @param PaymentResult  $result Result object for the transaction.
			 */
			do_action_ref_array( 'woocommerce_rest_checkout_process_payment_with_context', [ $context, &$result ] );

			if ( ! $result instanceof PaymentResult ) {
				throw new RouteException( 'woocommerce_rest_checkout_invalid_payment_result', __( 'Invalid payment result received from payment method.', 'woo-gutenberg-products-block' ), 500 );
			}

			return $result;
		} catch ( \Exception $e ) {
			throw new RouteException( 'woocommerce_rest_checkout_process_payment_error', $e->getMessage(), 400 );
		}
	}

	/**
	 * Gets the chosen payment method ID from the request.
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return string
	 */
	protected function get_request_payment_method_id( \WP_REST_Request $request ) {
		return isset( $request['payment_method'] )
			? wc_clean( wp_unslash( $request['payment_method'] ) )
			: '';
	}

	/**
	 * Gets the chosen payment method from the request.
	 *
	 * @throws RouteException On error.
	 * @param \WP_REST_Request $request Request object.
	 * @return \WC_Payment_Gateway
	 */
	protected function get_request_payment_method( \WP_REST_Request $request ) {
		$payment_method_id     = $this->get_request_payment_method_id( $request );
		$gateways              = wc()->payment_gateways->payment_gateways();
		$payment_method_object = isset( $gateways[ $payment_method_id ] ) ? $gateways[ $payment_method_id ] : false;

		// The abstract gateway is available method uses the cart global, so instead, check enabled directly.
		if ( ! $payment_method_object || ! wc_string_to_bool( $payment_method_object->enabled ) ) {
			throw new RouteException(
				'woocommerce_rest_checkout_payment_method_disabled',
				__( 'This payment gateway is not available.', 'woo-gutenberg-products-block' ),
				400
			);
		}

		return $payment_method_object;
	}

	/**
	 * Gets and formats payment request data.
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return array
	 */
	protected function get_request_payment_data( \WP_REST_Request $request ) {
		static $payment_data = [];
		if ( ! empty( $payment_data ) ) {
			return $payment_data;
		}
		if ( ! empty( $request['payment_data'] ) ) {
			foreach ( $request['payment_data'] as $data ) {
				$payment_data[ sanitize_key( $data['key'] ) ] = wc_clean( $data['value'] );
			}
		}

		return $payment_data;
	}

	/**
	 * Order processing relating to customer account.
	 *
	 * - Creates a customer account as needed (based on request & store settings).
	 *   - If so, updates the order with the new customer ID.
	 * - Updates the order with user details (e.g. address).
	 *
	 * @param \WC_Order        $order   Order object.
	 * @param \WP_REST_Request $request Request object.
	 */
	protected function process_customer( \WC_Order $order, \WP_REST_Request $request ) {
		$order_controller = new OrderController();

		// Create a new user account as necessary.
		// Note - CreateAccount class includes feature gating logic (i.e. this
		// may not create an account depending on build).
		if ( defined( 'WC_VERSION' ) && version_compare( WC_VERSION, '4.7', '>=' ) ) {
			// Checkout signup is feature gated to WooCommerce 4.7 and newer;
			// Because it requires updated my-account/lost-password screen in 4.7+
			// for setting initial password.
			try {
				$create_account = Package::container()->get( CreateAccount::class );
				$create_account->from_order_request( $request );
				$order->set_customer_id( get_current_user_id() );
			} catch ( Exception $error ) {
				$this->handle_error( $error );
			}
		}

		// Persist customer address data to account.
		$order_controller->sync_customer_data_with_order( $order );
	}

}
