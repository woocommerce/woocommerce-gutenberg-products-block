const path = require( 'path' );
const baseE2Econfig = require( '@woocommerce/e2e-env' ).jestConfig;

module.exports = {
    ...baseE2Econfig,
    transformIgnorePatterns: [ 'node_modules/(?!(woocommerce|@woocommerce\/e2e-env)/)' ],
	// Where to look for test files
	roots: [ path.resolve( __dirname, '../specs' ) ],
};
