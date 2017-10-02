import { Position } from '.'

export class Server {
	id    : string
	url   : string
	center: Position
	radius: number

	constructor(rawServer) {
		this.id     = rawServer.id
		this.url    = rawServer.url
		this.center = new Position(rawServer.center)
		this.radius = rawServer.radius
	}
}
