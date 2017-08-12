import { Position, Transport, Normalized, normalizeArray } from '../models'

import {
	REQUEST_TRANSPORTS, RECEIVE_TRANSPORTS,
	SELECT_TRANSPORT, UNSELECT_TRANSPORT,
	transportActions
} from '../actions'


// STATE TYPE
export type TransportsState = {
	items      : Normalized<Transport>
	selected   : Transport | null
	fetching   : number
	lastUpdated: { date: number, position: Position }
}


// DEFAULT STATE
const defaultState: TransportsState = {
	items      : {},
	selected   : null,
	fetching   : 0,
	lastUpdated: { date: 0, position: new Position() },
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
				...normalizeArray(action.transports)
			},
			fetching: state.fetching - 1,
			lastUpdated: { date: action.date, position: action.position },
		}
	case SELECT_TRANSPORT:
		return {
			...state,
			selected: action.transport
		}
	case UNSELECT_TRANSPORT:
		return {
			...state,
			selected: null
		}
	default:
		return state
	}
}
