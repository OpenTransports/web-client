import { Dispatch } from 'react-redux'

import { Transport, TransportType, Position } from '../models'
import { RootState } from '../reducers/configureStore'
import { toggleMap } from '.'

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
	transports: Array<Transport>
	date      : number
	radius    : number
	position  : Position
}

type selectTransportAction = {
	type       : 'SELECT_TRANSPORT'
	transportID: string
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
		// Don't fetch if allready fetching
		if (prevState.transports.isFetching) return

		dispatch(requestTransports())

		// For each server covering the user position, fetch the transports
		let promises = []
		let nearServers = Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => server.URL)
		for (let serverURL of nearServers) {
			promises.push(
				fetch(`${serverURL}/transports?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${getState().radius}`)
					.then(response => response.json())
					.then(json => json.map((rawTransport: any) => new Transport(rawTransport)))
			)
		}

		// Put all received agency into one array
		let flattenTransports = [] as Transport[]
		for (let p of promises) {
			try {
				flattenTransports = flattenTransports.concat(await p)
			} catch (e) {
				console.error(e)
			}
		}

		dispatch(receiveTransports(flattenTransports, userPosition, radius))
	}
}

export function selectTransport(transportID: string) {
	return (dispatch: Dispatch<{}>, getState: () => RootState) => {
		if (!getState().drawers.mapIsOpen) {
			dispatch(toggleMap())
		}
		dispatch({
			type: SELECT_TRANSPORT,
			transportID,
		})
	}
}
