import { Dispatch } from 'react-redux'

import { Agency, Position } from '../models'
import { OTState } from '../reducers/opentransports'

// TYPES
export type REQUEST_AGENCIES = 'REQUEST_AGENCIES'
export type RECEIVE_AGENCIES = 'RECEIVE_AGENCIES'
export type TOGGLE_AGENCY    = 'TOGGLE_AGENCY'
export type AgenciesOtherAction = { type: '' }

export const REQUEST_AGENCIES : REQUEST_AGENCIES = "REQUEST_AGENCIES"
export const RECEIVE_AGENCIES : RECEIVE_AGENCIES = "RECEIVE_AGENCIES"
export const TOGGLE_AGENCY    : TOGGLE_AGENCY    = "TOGGLE_AGENCY"
export const AgenciesOtherAction : AgenciesOtherAction = { type: '' }

export type requestAgenciesAction = {
	type: REQUEST_AGENCIES,
}
export type receiveAgenciesAction = {
	type: RECEIVE_AGENCIES,
	agencies: Array<Agency>,
	receivedAt: number,
	receivedPos: Position,
}
export type toggleAgencyAction = {
	type: TOGGLE_AGENCY,
	agencyID: string,
}

export type AgencyAction =
	requestAgenciesAction |
	receiveAgenciesAction |
	toggleAgencyAction |
	AgenciesOtherAction


// CREATORS
function requestAgencies(p: Position): requestAgenciesAction {
	return {
		type: REQUEST_AGENCIES,
	}
}

function receiveAgencies(regions: Array<Agency>, position: Position): receiveAgenciesAction {
	return {
		type: RECEIVE_AGENCIES,
		agencies: regions,
		receivedAt: Date.now(),
		receivedPos: position,
	}
}


// FUNCTIONS
export function fetchAgencies(p: Position) {
	return (dispatch: Dispatch<{}>, getState: () => OTState) => {
		if (getState().agencies.isFetching) return
		dispatch(requestAgencies(p))
		fetch(`/api/agencies?latitude=${p.latitude}&longitude=${p.longitude}&radius=${getState().radius}`)
			.then(response => response.json())
			.then(json => json.map((rawAgency: any) => new Agency(rawAgency)))
			.then(regions => dispatch(receiveAgencies(regions, p)))
			.catch(err => console.error(err))
	}
}

export function toggleAgency(agencyID: string) {
	return (dispatch: Dispatch<{}>) => {
		dispatch({
			type: TOGGLE_AGENCY,
			agencyID: agencyID,
		})
	}
}
