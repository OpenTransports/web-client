import { TransportType, Position } from '.'

class TypeInfo {
	name: string
	icon: string
}


export class Agency {
	id      : string
	serverID: string
	url     : string
	git     : string
	name    : string
	center  : Position
	radius  : number
	types   : { [name: string]: TypeInfo}

	constructor(rawAgency: Agency, serverID: string) {
		this.id       = rawAgency.id
		this.serverID = serverID
		this.url      = rawAgency.url
		this.git      = rawAgency.git
		this.name     = rawAgency.name
		this.center   = new Position(rawAgency.center)
		this.radius   = rawAgency.radius
		this.types    = rawAgency.types
	}
}
