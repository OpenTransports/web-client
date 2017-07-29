import { Position } from '.'

export class Server {
	ID    : string
	URL   : string
	center: Position
	radius: number

	constructor(rawServer) {
		this.ID     = rawServer.ID
		this.URL    = rawServer.URL
		this.center = new Position(rawServer.center)
		this.radius = rawServer.radius
	}
}
