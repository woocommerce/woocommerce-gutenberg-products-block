#!/bin/bash

echo "Initializing WooCommerce Gutenberg Product Blocks E2E"

wp plugin install woocommerce --activate
wp plugin activate woocommerce-gutenberg-products-block
wp theme install twentynineteen --activate
wp user create customer customer@woocommercecoree2etestsuite.com --user_pass=password --role=customer --path=/var/www/html
wp post create --post_type=page --post_status=publish --post_title='Ready' --post_content='Wootenberg-E2E-tests.'