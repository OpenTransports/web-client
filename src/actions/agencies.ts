import { Dispatch } from 'react-redux'
import { REHYDRATE } from 'redux-persist/constants'

import { Agency, Position } from '../models'
import { RootState } from '../reducers/configureStore'
import { redrawTransports } from '.'

// TYPES
export const REQUEST_AGENCIES = "REQUEST_AGENCIES"
export const RECEIVE_AGENCIES = "RECEIVE_AGENCIES"
export const TOGGLE_AGENCY    = "TOGGLE_AGENCY"
export const TOGGLE_TYPE      = "TOGGLE_TYPE"

export type requestAgenciesAction = {
	type: 'REQUEST_AGENCIES'
}
export type receiveAgenciesAction = {
	type: 'RECEIVE_AGENCIES'
	agencies: Agency[]
	date: Date
	userPosition: Position
}
export type toggleAgencyAction = {
	type: 'TOGGLE_AGENCY'
	agencyID: string
}

type toggleTypeAction = {
	type: 'TOGGLE_TYPE'
	agencyID: string
	typeID: string
}

export type agenciesActions =
	requestAgenciesAction |
	receiveAgenciesAction |
	toggleAgencyAction    |
	toggleTypeAction      |
	{ type: 'persist/REHYDRATE', payload: any, error: any }


// CREATORS
function requestAgencies(): requestAgenciesAction {
	return {
		type: REQUEST_AGENCIES,
	}
}

function receiveAgencies(agencies: Agency[], userPosition: Position): receiveAgenciesAction {
	return {
		type: RECEIVE_AGENCIES,
		date: new Date(),
		agencies,
		userPosition,
	}
}


// FUNCTIONS
// 1. Dispatch requestAgencies action
// 2. Fetch agencies for all servers covering the passed position
// 3. Dispatch receivedAgencies action
// @param position <Position> the position around which the fetch the agencies
export function fetchAgencies() {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const { userPosition, radius, servers } = getState()

		// For each server covering the user position, fetch the agencies
		Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.radius === -1 || server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => server)
			.map((server) => new Promise(async () => {
					dispatch(requestAgencies())
					const response = await fetch(`${server.url}/agencies?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${radius}`)
					const agencies = (await response.json()).map((rawAgency: any) => new Agency(rawAgency, server.id))
					dispatch(receiveAgencies(agencies, userPosition))
					dispatch(redrawTransports())
				})
			)
	}
}



export function toggleAgency(agencyID: string) {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		dispatch({
			type: TOGGLE_AGENCY,
			agencyID,
		})
		dispatch(redrawTransports())
	}
}

export function toggleType(agencyID: string, typeID: string) {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		dispatch({
			type: TOGGLE_TYPE,
			agencyID,
			typeID,
		})
		dispatch(redrawTransports())
	}
}
