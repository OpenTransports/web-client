export class Position {
	latitude : number
	longitude: number
	heading? : number

	// Default position is { 0, 0 }
	constructor(rawPosition?: any) {
		rawPosition = rawPosition || {latitude: 0, longitude: 0}
		this.map(rawPosition)
	}

	map(rawPosition: any): void {
		this.latitude  = rawPosition.latitude
		this.longitude = rawPosition.longitude
		this.heading   = rawPosition.heading
	}

	// @param position <Position> the position
	// @return <number> the distance between the inner position and a given position in meter
	distanceFrom(position: Position): number {
		const dLat = (this.latitude  - position.latitude ) * Math.PI / 180
		const dLon = (this.longitude - position.longitude) * Math.PI / 180

		const a = Math.sin(dLat / 2)
		const b = Math.sin(dLon / 2)
		const c = Math.cos(this.latitude * Math.PI / 180) * Math.cos(position.latitude * Math.PI / 180)
		const d = (a * a) + c*(b*b)

		// 6371000 => Average earth radius in meters
		return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1-d)))
	}

	isEqual(position2): boolean {
		return this.latitude == position2.latitude && this.longitude == position2.longitude
	}
}
