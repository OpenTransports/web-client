declare module "*.json" {
	const value: any;
	export default value;
}


declare var MOCK_SERVERS: {
	id : string,
	url: string,
	center: {
		latitude : number,
		longitude: number
	},
	radius: number
}


declare var MOCK_POSITION: {
	latitude : number,
	longitude: number
}
