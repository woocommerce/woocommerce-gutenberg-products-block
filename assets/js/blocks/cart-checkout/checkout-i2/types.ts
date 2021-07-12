export type InnerBlockTemplate = [
	string,
	Record< string, unknown >,
	InnerBlockTemplate[] | undefined
];
