import { Dispatch } from 'react-redux'

import { Transport, Position } from '../models'
import { OTState } from '../reducers/opentransports'


// TYPES
export const REQUEST_TRANSPORTS = "REQUEST_TRANSPORTS"
export const RECEIVE_TRANSPORTS = "RECEIVE_TRANSPORTS"
export const SELECT_TRANSPORT = "SELECT_TRANSPORT"
export const UNSELECT_TRANSPORT = "UNSELECT_TRANSPORT"

export type transportAction = {
	type: 'REQUEST_TRANSPORTS',
} | {
	type: 'RECEIVE_TRANSPORTS',
	transports: Array<Transport>,
	receivedAt: number,
	receivedPos: Position,
} | {
	type: 'SELECT_TRANSPORT',
	transport: Transport,
} | {
	type: 'UNSELECT_TRANSPORT',
}


// CREATORS
function requestTransports(p: Position): transportAction {
	return {
		type: REQUEST_TRANSPORTS
	}
}

function receiveTransports(transports: Array<Transport>, position: Position): transportAction {
	return {
		type: RECEIVE_TRANSPORTS,
		transports: transports,
		receivedAt: Date.now(),
		receivedPos: position,
	}
}

export function selectTransport(transport: Transport) {
	return {
		type: SELECT_TRANSPORT,
		transport: transport,
	}
}

export function unselectTransport(transport: Transport) {
	return {
		type: UNSELECT_TRANSPORT,
	}
}


// FUNCTIONS
export function fetchTransports(p: Position) {
	return (dispatch: Dispatch<{}>, getState: () => OTState) => {
		if (getState().transports.isFetching) return
		dispatch(requestTransports(p))
		fetch(`/api/transports?latitude=${p.latitude}&longitude=${p.longitude}&radius=${getState().radius}`)
			.then(response => response.json())
			.then(json => json.map((rawTransport: any) => new Transport(rawTransport)))
			.then(transports => dispatch(receiveTransports(transports, p)))
			.catch(err => console.error(err))
	}
}
