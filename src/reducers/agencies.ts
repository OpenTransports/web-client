import { Normalized, normalizeArray, toggleItem } from './normalize'

import { Position, Agency } from '../models'

import {
	REQUEST_AGENCIES, RECEIVE_AGENCIES,
	TOGGLE_AGENCY,
	agenciesActions
} from '../actions'


// STATE TYPE
export type AgenciesState = {
	items      : Normalized<Agency>
	activated  : string[]
	isFetching : boolean
	lastUpdated: { date: number, position: Position }
}


// DEFAULT STATE
const defaultState: AgenciesState = {
	items      : {},
	activated  : [] as string[],
	isFetching : false,
	lastUpdated: { date: 0, position: new Position() },
}


// REDUCERS
export function agencies(state = defaultState, action: agenciesActions): AgenciesState {
	switch (action.type) {
	case REQUEST_AGENCIES:
		return {
			...state,
			isFetching: true,
		}
	case RECEIVE_AGENCIES:
		return {
			...state,
			items: {
				...state.items,
				...normalizeArray(action.agencies)
			},
			activated: action.agencies.reduce(function(activated, agency){
				activated[agency.ID] = activated[agency.ID] != undefined ? activated[agency.ID] : true
				return activated
			}, state.activated),
			lastUpdated: { date: action.date, position: action.position },
			isFetching: false,
		}
	case TOGGLE_AGENCY:
		return {
			...state,
			activated: toggleItem(state.activated, action.agencyID)
		}
	default:
		return state
	}
}
