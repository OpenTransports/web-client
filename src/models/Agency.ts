import { TransportType, Position } from '.'

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
