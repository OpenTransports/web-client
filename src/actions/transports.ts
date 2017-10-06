import { Dispatch } from 'react-redux'

import { Transport, TransportType, Position } from '../models'
import { AgenciesState } from '../reducers'
import { RootState } from '../reducers/configureStore'
import { toggleMap, getItinerary, getLineRouteForTransport } from '.'

// TYPES
export const REQUEST_TRANSPORTS = "REQUEST_TRANSPORTS"
export const RECEIVE_TRANSPORTS = "RECEIVE_TRANSPORTS"
export const SELECT_TRANSPORT   = "SELECT_TRANSPORT"
export const UNSELECT_TRANSPORT = "UNSELECT_TRANSPORT"
export const REDRAW_TRANSPORTS  = "REDRAW_TRANSPORTS"

type requestTransportsAction = {
	type: 'REQUEST_TRANSPORTS'
}

type receiveTransportsAction = {
	type: 'RECEIVE_TRANSPORTS'
	payload: {
		transports: Transport[]
	}
	meta: {
		date: Date
		userPosition: Position
	}
}

type selectTransportAction = {
	type: 'SELECT_TRANSPORT'
	payload: {
		transport: Transport
	}
}

type unselectTransportAction = {
	type: 'UNSELECT_TRANSPORT'
}

type redrawTransportsAction = {
	type: 'REDRAW_TRANSPORTS'
	meta: {
		agencies: AgenciesState
		userPosition: Position
		radius: number
	}
}

export type transportActions =
	requestTransportsAction |
	receiveTransportsAction |
	selectTransportAction   |
	unselectTransportAction |
	redrawTransportsAction


// CREATORS
function requestTransports(): requestTransportsAction {
	return {
		type: REQUEST_TRANSPORTS
	}
}

function receiveTransports(transports: Array<Transport>, userPosition: Position): receiveTransportsAction {
	return {
		type: RECEIVE_TRANSPORTS,
		payload: {
			transports,
		},
		meta: {
			date: new Date(),
			userPosition,
		},
	}
}

export function unselectTransport(): unselectTransportAction {
	return {
		type: UNSELECT_TRANSPORT,
	}
}

export function redrawTransports(agencies: AgenciesState, userPosition: Position, radius: number): redrawTransportsAction {
	return {
		type: 'REDRAW_TRANSPORTS',
		meta: {
			agencies,
			userPosition,
			radius,
		},
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
		const { userPosition, radius, servers, agencies } = prevState

		// For each server covering the user position, fetch the transports
		Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.radius === -1 || server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => new Promise(async () => {
				dispatch(requestTransports())
				const response = await fetch(`${server.url}/transports?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${getState().radius}`)
				const transports: Transport[] = (await response.json()).map((rawTransport: any) => new Transport(rawTransport))
				dispatch(receiveTransports(transports, userPosition))
				transports
					.filter(transport => {
						return transport.type === TransportType.Tram ||
							   transport.type === TransportType.Metro ||
							   transport.type === TransportType.Bus ||
							   transport.type === TransportType.Rail
					})
					.forEach((transport) => dispatch(getLineRouteForTransport(transport)))
				dispatch(redrawTransports(agencies, userPosition, radius))
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
		// dispatch(getItinerary(userPosition, transport.position))
		dispatch({
			type: SELECT_TRANSPORT,
			transport: transport,
		})
	}
}
