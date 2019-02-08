export const categories = {
	type: 'array',
	shortcode: function( attributes ) {
		if ( attributes.named.category ) {
			return attributes.named.category.split( ',' );
		}
		return [];
	},
};

export const catOperator = {
	type: 'string',
	shortcode: function( attributes ) {
		const operator = attributes.named.cat_operator || '';
		if ( operator.toUpperCase() === 'AND' ) {
			return 'all';
		}
		return 'any';
	},
};

export const columns = {
	type: 'number',
	shortcode: function( attributes ) {
		const cols = attributes.named.columns || wc_product_block_data.default_columns;
		return Number( cols );
	},
};

export const editMode = {
	type: 'boolean',
	shortcode: () => false,
};

export const products = {
	type: 'array',
	shortcode: function( attributes ) {
		const { ids = '' } = attributes.named;
		if ( ids.length ) {
			return ids.split( ',' );
		}
		return [];
	},
};

export const rows = {
	type: 'number',
	shortcode: function( attributes ) {
		const cols = attributes.named.columns || wc_product_block_data.default_columns;
		const { limit } = attributes.named;
		if ( ! limit ) {
			return wc_product_block_data.default_rows;
		}
		return limit / cols;
	},
};
