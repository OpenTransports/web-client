import { Position, Agency, Normalized, normalizeArray, toggleItem } from '../models'

import {
	REQUEST_AGENCIES, RECEIVE_AGENCIES,
	TOGGLE_AGENCY, TOGGLE_TYPE,
	agenciesActions
} from '../actions'


// STATE TYPE
export type AgenciesState = {
	items         : Normalized<Agency>
	activated     : string[]
	activatedTypes: string[]
	fetching      : number
	lastUpdated   : { date: number, position: Position }
}


// DEFAULT STATE
const defaultState: AgenciesState = {
	items         : {},
	activated     : [] as string[],
	activatedTypes: [],
	fetching      : 0,
	lastUpdated   : { date: 0, position: new Position() },
}


// REDUCERS
export function agencies(state = defaultState, action: agenciesActions): AgenciesState {
	switch (action.type) {
	case REQUEST_AGENCIES:
		return {
			...state,
			fetching: state.fetching + 1,
		}
	case RECEIVE_AGENCIES:
		return {
			...state,
			items: {
				...state.items,
				...normalizeArray(action.agencies),
			},
			activated: action.agencies
				.filter(agency => state.items[agency.ID] == undefined)
				.map(agency => agency.ID)
				.concat(state.activated),
			activatedTypes: action.agencies
				.filter(agency => state.items[agency.ID] == undefined)
				.map(agency => agency.types.map(typeID => agency.ID+String(typeID)))
				.reduce(((allTypes, types) => allTypes.concat(types)), state.activatedTypes),
			lastUpdated: { date: action.date, position: action.position },
			fetching: state.fetching - 1,
		}
	case TOGGLE_AGENCY:
		return {
			...state,
			activated: toggleItem(state.activated, action.agencyID)
		}
	case TOGGLE_TYPE:
		return {
			...state,
			activatedTypes: toggleItem(state.activatedTypes, action.agencyID+String(action.typeID))
		}
	default:
		return state
	}
}
