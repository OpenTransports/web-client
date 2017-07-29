declare module "*.json" {
	const value: any;
	export default value;
}


declare var MOCK_SERVERS: {
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
