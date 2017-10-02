import { Position } from '.'

export class LineRoute {
	id    : string
	color : string
	points: Position[]

	constructor(rawLineRoute: LineRoute) {
		this.id     = rawLineRoute.id
		this.color  = rawLineRoute.color
		this.points = rawLineRoute.points
	}
}
