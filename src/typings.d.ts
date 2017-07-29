declare module "*.json" {
	const value: any;
	export default value;
}


declare var TEST_SERVER: {
	ID: number,
	url: string,
	position: {
		latitude: number,
		longitude: number
	},
	radius: number
}


declare var MOCK_POSITION: {
	latitude: number,
	longitude: number
}
