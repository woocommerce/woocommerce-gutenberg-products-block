#!/bin/sh

BLOCKS_DIR_NAME=$1
TMP_DIR="/tmp"
WOO_DIR="/app/bin/woocommerce"
echo $BLOCKS_DIR_NAME

if [ ! -d "$WOO_DIR/src" ]; then
	rm -rf "$WOO_DIR/tests"
	git clone --depth 1 "https://github.com/woocommerce/woocommerce.git" "$WOO_DIR"
fi
