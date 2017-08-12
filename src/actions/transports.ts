import { Dispatch } from 'react-redux'

import { Transport, TransportType, Position } from '../models'
import { RootState } from '../reducers/configureStore'
import { toggleMap, getRoute } from '.'

// TYPES
export const REQUEST_TRANSPORTS    = "REQUEST_TRANSPORTS"
export const RECEIVE_TRANSPORTS    = "RECEIVE_TRANSPORTS"
export const SELECT_TRANSPORT      = "SELECT_TRANSPORT"
export const UNSELECT_TRANSPORT    = "UNSELECT_TRANSPORT"

type requestTransportsAction = {
	type: 'REQUEST_TRANSPORTS'
}

type receiveTransportsAction = {
	type      : 'RECEIVE_TRANSPORTS'
	transports: Transport[]
	date      : number
	radius    : number
	position  : Position
}

type selectTransportAction = {
	type     : 'SELECT_TRANSPORT'
	transport: Transport
}

type unselectTransportAction = {
	type: 'UNSELECT_TRANSPORT'
}

export type transportActions =
	requestTransportsAction |
	receiveTransportsAction |
	selectTransportAction   |
	unselectTransportAction


// CREATORS
function requestTransports(): requestTransportsAction {
	return {
		type: REQUEST_TRANSPORTS
	}
}

function receiveTransports(transports: Array<Transport>, position: Position, radius: number): receiveTransportsAction {
	return {
		type: RECEIVE_TRANSPORTS,
		date: Date.now(),
		transports,
		position,
		radius
	}
}

export function unselectTransport(): unselectTransportAction {
	return {
		type: UNSELECT_TRANSPORT,
	}
}


// FUNCTIONS
// 1. Dispatch requestTransports action
// 2. Fetch transports for all servers covering the passed position
// 3. Dispatch receivedTransports action
// @param position <Position> the position around which the fetch the transports
export function fetchTransports() {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const prevState = getState()
		const { userPosition, radius, servers } = prevState

		// For each server covering the user position, fetch the transports
		Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => new Promise(async () => {
				dispatch(requestTransports())
				const response = await fetch(`${server.URL}/transports?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${getState().radius}`)
				const transports = (await response.json()).map((rawTransport: any) => new Transport(rawTransport))
				dispatch(receiveTransports(transports, userPosition, radius))
			}))
	}
}

export function selectTransport(transportID: string) {
	return (dispatch: Dispatch<{}>, getState: () => RootState) => {
		if (!getState().drawers.mapIsOpen) {
			dispatch(toggleMap())
		}
		const { transports, userPosition } = getState()
		const transport = transports.items[transportID]
		// dispatch(getRoute(userPosition, transport.position))
		dispatch({
			type     : SELECT_TRANSPORT,
			transport: transport,
		})
	}
}
