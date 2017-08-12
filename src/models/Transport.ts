import { Position, Agency } from '.'

export class Transport {
	ID        : string
	agencyID  : string
	name      : string
	type      : TransportType
	position  : Position
	iconURL   : string
	line      : string
	passages? : Passage[]
	available?: number
	empty?    : number

	constructor(rawTransport: any) {
		this.ID        = rawTransport.ID
		this.agencyID  = rawTransport.agencyID
		this.name      = rawTransport.name
		this.type      = rawTransport.type
		this.position  = new Position(rawTransport.position)
		this.iconURL   = rawTransport.iconURL
		this.line      = rawTransport.line
		this.passages  = rawTransport.passages
		this.available = rawTransport.available
		this.empty     = rawTransport.empty
	}
}


type Passage = {
	direction: string
	times: string[]
}


export enum TransportType {
	Tram = 0,
	Metro,
	Rail,
	Bus,
	Ferry,
	Cable,
	Gondola,
	Funicular,
	Bike,
	Car,
	Unknown,
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
