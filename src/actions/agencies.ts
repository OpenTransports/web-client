import { Dispatch } from 'react-redux'

import { Agency, Position, Server } from '../models'
import { RootState } from '../reducers/configureStore'


// TYPES
export const REQUEST_AGENCIES = "REQUEST_AGENCIES"
export const RECEIVE_AGENCIES = "RECEIVE_AGENCIES"
export const TOGGLE_AGENCY    = "TOGGLE_AGENCY"

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

export type agenciesActions =
	requestAgenciesAction |
	receiveAgenciesAction |
	toggleAgencyAction


// CREATORS
function requestAgencies(): requestAgenciesAction {
	return {
		type: REQUEST_AGENCIES,
	}
}

function receiveAgencies(agencies: Array<Agency>, position: Position, radius: number): receiveAgenciesAction {
	return {
		type    : RECEIVE_AGENCIES,
		date    : Date.now(),
		agencies,
		position,
		radius,
	}
}

export function toggleAgency(agencyID: string): toggleAgencyAction {
	return {
		type: TOGGLE_AGENCY,
		agencyID: agencyID,
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

		// Don't fetch if allready fetching
		if (prevState.agencies.isFetching) return

		dispatch(requestAgencies())

		// For each server covering the user position, fetch the agencies
		let promises = []
		let nearServers = Object.keys(servers.items)
			.map(serverID => servers.items[serverID])
			.filter(server => server.center.distanceFrom(userPosition) <= server.radius)
			.map(server => server.URL)
		for (let serverURL of nearServers) {
			promises.push(
				fetch(`${serverURL}/agencies?latitude=${userPosition.latitude}&longitude=${userPosition.longitude}&radius=${prevState.radius}`)
					.then(response => {
						console.log(response)
						return response.json()
					})
					.then(json => json.map((rawAgency: any) => new Agency(rawAgency)))
			)
		}

		// Put all received agency into one array
		let flattenAgencies = [] as Agency[]
		for (let p of promises) {
			try {
				flattenAgencies = flattenAgencies.concat(await p)
			} catch (e) {
				console.error(e)
			}
		}

		dispatch(receiveAgencies(flattenAgencies, userPosition, radius))
	}
}
