import { Dispatch } from 'react-redux'

import { Agency, TransportType, Position, Server } from '../models'
import { RootState } from '../reducers/configureStore'


// TYPES
export const REQUEST_AGENCIES = "REQUEST_AGENCIES"
export const RECEIVE_AGENCIES = "RECEIVE_AGENCIES"
export const TOGGLE_AGENCY    = "TOGGLE_AGENCY"
export const TOGGLE_TYPE      = "TOGGLE_TYPE"

export type requestAgenciesAction = {
	type: 'REQUEST_AGENCIES',
}
export type receiveAgenciesAction = {
	type    : 'RECEIVE_AGENCIES',
	agencies: Array<Agency>,
	date    : number,
	radius  : number,
	position: Position,
}
export type toggleAgencyAction = {
	type    : 'TOGGLE_AGENCY',
	agencyID: string,
}

type toggleTypeAction = {
	type    : 'TOGGLE_TYPE'
	agencyID: string
	typeID  : string
}

export type agenciesActions =
	requestAgenciesAction |
	receiveAgenciesAction |
	toggleAgencyAction    |
	toggleTypeAction


// CREATORS
function requestAgencies(): requestAgenciesAction {
	return {
		type: REQUEST_AGENCIES,
	}
}

function receiveAgencies(agencies: Array<Agency>, position: Position, radius: number): receiveAgenciesAction {
	return {
		type: RECEIVE_AGENCIES,
		date: Date.now(),
		agencies,
		position,
		radius,
	}
}

export function toggleAgency(agencyID: string): toggleAgencyAction {
	return {
		type: TOGGLE_AGENCY,
		agencyID,
	}
}

export function toggleType(agencyID: string, typeID: string): toggleTypeAction {
	return {
		type: TOGGLE_TYPE,
		agencyID,
		typeID,
	}
}

// FUNCTIONS
// 1. Dispatch requestAgencies action
// 2. Fetch agencies for all servers covering the passed position
// 3. Dispatch receivedAgencies action
// @param position <Position> the position around which the fetch the agencies
export function fetchAgencies() {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const prevState = getState()
		const { userPosition, radius, servers } = prevState

		// For each server covering the user position, fetch the agencies
		Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.radius === -1 || server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => server)
			.map((server) => new Promise(async () => {
					dispatch(requestAgencies())
					const response = await fetch(`${server.URL}/agencies?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${prevState.radius}`)
					const agencies = (await response.json()).map((rawAgency: any) => new Agency(rawAgency, server.ID))
					dispatch(receiveAgencies(agencies, userPosition, radius))
				})
			)
	}
}
