import { Position, Transport } from '../models'

import {
	REQUEST_TRANSPORTS, RECEIVE_TRANSPORTS, SELECT_TRANSPORT, UNSELECT_TRANSPORT,
	transportAction
} from '../actions'


// TRANSPORTS STATE INTERFACE
export interface TransportsState {
	isFetching       : boolean,
	items            : Array<Transport>,
	lastUpdated      : { date: number, position: Position },
	selectedTransport: Transport | null
}


// DEFAULT STATE
const defaultState: TransportsState = {
	isFetching       : false,
	items            : [] as Array<Transport>,
	lastUpdated      : { date: 0, position: new Position() },
	selectedTransport: null,
}


// REDUCER
export function transports(state = defaultState, action: transportAction): TransportsState {
	switch (action.type) {
	case REQUEST_TRANSPORTS:
		return {
			...state,
			isFetching: true,
		}
	case RECEIVE_TRANSPORTS:
		return {
			...state,
			items: action.transports,
			isFetching: false,
			lastUpdated: { date: action.receivedAt, position: action.receivedPos },
		}
	case SELECT_TRANSPORT:
		return {
			...state,
			selectedTransport: action.transport
		}
	case UNSELECT_TRANSPORT:
		return {
			...state,
			selectedTransport: null
		}
		default:
		return {...state}
	}
}
