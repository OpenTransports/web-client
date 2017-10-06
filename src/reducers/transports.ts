import { Position, Transport, TransportType, Normalized, normalizeArray } from '../models'

import {
	REQUEST_TRANSPORTS, RECEIVE_TRANSPORTS,
	SELECT_TRANSPORT, UNSELECT_TRANSPORT,
	REDRAW_TRANSPORTS,
	transportActions, agenciesActions, positionActions, radiusActions
} from '../actions'

import { AgenciesState } from '.'


// STATE TYPE
export type TransportsState = {
	items: Normalized<Transport>
	selected: Transport | null
	visible: string[]
	fetching: number
	lastUpdated: { date: Date, position: Position }
}


// DEFAULT STATE
const defaultState: TransportsState = {
	items: {},
	selected: null,
	visible: [],
	fetching: 0,
	lastUpdated: { date: null, position: new Position() },
}


// REDUCERS
export function transports(state = defaultState, action: transportActions): TransportsState {
	switch (action.type) {
	case REQUEST_TRANSPORTS:
		return {
			...state,
			fetching: state.fetching + 1,
		}
	case RECEIVE_TRANSPORTS:
		return {
			...state,
			items: {
				...state.items,
				...normalizeArray(action.payload.transports),
			},
			fetching: state.fetching - 1,
			lastUpdated: { date: action.meta.date, position: action.meta.userPosition },
		}
	case SELECT_TRANSPORT:
		return {
			...state,
			selected: action.payload.transport
		}
	case UNSELECT_TRANSPORT:
		return {
			...state,
			selected: null
		}
	case REDRAW_TRANSPORTS:
		return {
			...state,
			visible: filterTransports(state.items, action.meta.agencies, action.meta.userPosition, action.meta.radius)
		}
	default:
		return state
	}
}


// 0 - Map items to Transports array
// 1 - Filter: Don't display Transports that are to fare
// 2 - Filter: Don't display Transports from non activated agencies
// 3 - Filter: Don't display Transports from non activated types
// 4 - Filter: Don't display Transports without an incomming passage
// 5 - Sort  : Order by distance from the user
// 6 - Reduce: Only allow transports of same line if they have at least one passage with a different direction
function filterTransports(
	transports: Normalized<Transport>, agencies: AgenciesState,
	userPosition: Position, radius: number): string[]
{
	return Object.keys(transports)
		.map(transportID => transports[transportID])
		.filter(transport => transport.position.distanceFrom(userPosition) <= radius)
		.filter(transport => agencies.activated.indexOf(transport.agencyID) != -1 )
		.filter(transport => agencies.activatedTypes.indexOf(transport.agencyID+String(transport.type)) != -1 )
		.filter(transport => transport.informations && transport.informations.length > 0)
		.sort((t1, t2) => t1.position.distanceFrom(userPosition) - t2.position.distanceFrom(userPosition))
		.reduce(((allTransports, t1) => {
			if (t1.type === TransportType.Bike || t1.type === TransportType.Car) {
				allTransports.push(t1)
				return allTransports
			}
			// Get all passages from allTransports for the line of t1
			const sameLineInformations = allTransports
				.filter(t2 => t1.line === t2.line)
				.reduce(((informations, t2) => informations.concat(t2.informations)), [])
			// Get unique passage in t1
			const uniquesPassages = t1.informations
				.filter(info1 => sameLineInformations.find(info2 => info1.title == info2.title) == undefined)
			// If t1 contains uniques passages, add it to allTransports
			if (uniquesPassages.length > 0) {
				allTransports.push(t1)
			}
			return allTransports
		}), [] as Transport[])
		.map(transport => transport.id)
}
