#!/bin/sh
BASENAME=$(basename "`pwd`")
WOO_DIR=$(pwd)
WOO_DIR="$WOO_DIR/bin/woocommerce"
echo $WOO_DIR

# Clone Woo Core so tests helpers are available. The phpunit bootstrap will check
# this folder for tests files.
# TODO: This is always bringing in the latest test helpers, eventually we'll
#       need to bring in the helpers for the version of Woo being tested.
npm run wp-env run composer './bin/wp-env-phpunit-config.sh ${BASENAME}'

# print php version in phpunit environment for verification
npm run wp-env run phpunit 'php -v'

# run phpunit
npm run wp-env run phpunit 'phpunit -c /var/www/html/wp-content/plugins/'$BASENAME'/phpunit.xml.dist --verbose'
