export class Position {
	latitude : number
	longitude: number

	// Default position is { 0, 0 }
	constructor(rawPosition?: any) {
		rawPosition = rawPosition || {latitude: 0, longitude: 0}
		this.map(rawPosition)
	}

	map(rawPosition: any): void {
		this.latitude  = rawPosition.latitude
		this.longitude = rawPosition.longitude
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


export class Agency {
	ID         : string
	serverID   : string
	URL        : string
	git        : string
	name       : string
	center     : Position
	radius     : number
	types      : TransportType[]
	typesString: string[]
	iconsURL   : { [name: number]: string }

	constructor(rawAgency: any, serverID: string) {
		this.ID          = rawAgency.ID
		this.serverID    = rawAgency.serverID
		this.URL         = rawAgency.URL
		this.git         = rawAgency.git
		this.name        = rawAgency.name
		this.center      = new Position(rawAgency.center)
		this.radius      = rawAgency.radius
		this.types       = rawAgency.types
		this.typesString = rawAgency.typesString
		this.iconsURL    = rawAgency.iconsURL
	}
}

type Passage = {
	direction: string
	times: Array<string>
}

enum TransportType {
	Tram = 0,
	Metro,
	Rail,
	Bus,
	Ferry,
	Bike,
	Unknown,
}

export class Transport {
	ID       : string
	agencyID : string
	name     : string
	type     : TransportType
	position : Position
	iconURL  : string
	line     : string
	passages?: Array<Passage>
	count?   : number

	constructor(rawTransport: any) {
		if (rawTransport.passages == null) {
			console.log(rawTransport)
		}
		this.ID        = rawTransport.ID
		this.agencyID  = rawTransport.agencyID
		this.name      = rawTransport.name
		this.type      = rawTransport.type
		this.position  = new Position(rawTransport.position)
		this.iconURL   = rawTransport.iconURL
		this.line      = rawTransport.line
		this.passages  = rawTransport.passages
		this.count     = rawTransport.count
	}
}


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


export class TransportsCluster {
	agency    : Agency
	transports: Transport[]
	position  : Position
	type      : TransportType

	constructor(agency: Agency, transports?: Transport[]) {
		this.agency = agency
		this.transports = []

		if (transports != undefined) {
			this.addTransport(transports)
		}
	}

	addTransport(transports: Transport[]) {
		if (transports.length == 0) return

		this.transports = this.transports.concat(transports)

		if (this.position == undefined) {
			this.position = transports[0].position
		}
		if (this.type == undefined) {
			this.type = transports[0].type
		}

		for (let transport of transports) {
			if (!transport.position.isEqual(this.position)) {
				throw "Transport and cluster position are different"
			}
			if (transport.type != this.type) {
				throw "Transport and cluster type are different"
			}
		}
	}
}
