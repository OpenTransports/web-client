import { TransportType, Position } from '.'

class TypeInfo {
	name: string
	icon: string
}


export class Agency {
	ID      : string
	serverID: string
	URL     : string
	git     : string
	name    : string
	center  : Position
	radius  : number
	types   : { [name: string]: TypeInfo}

	constructor(rawAgency: any, serverID: string) {
		this.ID       = rawAgency.id
		this.serverID = serverID
		this.URL      = rawAgency.url
		this.git      = rawAgency.git
		this.name     = rawAgency.name
		this.center   = new Position(rawAgency.center)
		this.radius   = rawAgency.radius
		this.types    = rawAgency.types
	}
}
