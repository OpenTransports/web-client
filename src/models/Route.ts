import { Position } from './'

export class Route {
	from    : Position
	to      : Position
	distance: number
	duration: number
	points  : Position[]

	constructor(from: Position, to: Position, rawRoute: any) {
		this.from     = from
		this.to       = to
		this.distance = rawRoute.distance
		this.duration = rawRoute.duration
		this.points   = rawRoute.geometry.coordinates
			.map((coord) => {
				return new Position({
					latitude : coord[1],
					longitude: coord[0],
				})
			})
		this.points.unshift(from)
	}
}
