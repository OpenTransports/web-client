import { Position } from './'

export class Itinerary {
	from    : Position
	to      : Position
	distance: number
	duration: number
	points  : Position[]

	constructor(from: Position, to: Position, rawItinerary: any) {
		this.from     = from
		this.to       = to
		this.distance = rawItinerary.distance
		this.duration = rawItinerary.duration
		this.points   = rawItinerary.geometry.coordinates
			.map((coord) => {
				return new Position({
					latitude : coord[1],
					longitude: coord[0],
				})
			})
		this.points.unshift(from)
	}
}
