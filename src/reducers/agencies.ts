import { REHYDRATE } from 'redux-persist/constants'

import { Position, Agency, Normalized, normalizeArray, toggleItem, mapItems } from '../models'

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
	lastUpdated   : { date: Date, position: Position }
}


// DEFAULT STATE
const defaultState: AgenciesState = {
	items         : {},
	activated     : [] as string[],
	activatedTypes: [],
	fetching      : 0,
	lastUpdated   : { date: null, position: new Position() },
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
			// All agencies accessible through their ID
			items: {
				...state.items,
				...normalizeArray(action.agencies),
			},
			// Array of ID of activated agencies
			// 1. Keep only the new agencies
			// 2. Get their ID
			// 3. Add their ID to the list
			// ==> All new agencies are activated by default
			activated: action.agencies
				.filter(agency => state.items[agency.id] == undefined)
				.map(agency => agency.id)
				.concat(state.activated),
			// Array of ID of activated types
			// 1. Keep only new agencies
			// 2. Get an Array of all the type for all the agencies
			// 3. Merge those Arrays
			// ==> All types of new agencies are activated by default
			// ==> A type ID is agencyID+typeID
			activatedTypes: action.agencies
				.filter(agency => state.items[agency.id] == undefined)
				.map(agency => Object.keys(agency.types).map(typeID => agency.id+typeID))
				.reduce(((allTypes, types) => allTypes.concat(types)), state.activatedTypes),
			lastUpdated: { date: action.date, position: action.userPosition },
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
	case REHYDRATE:
		if (action.payload.agencies === undefined) {
			return state
		}
		action.payload.agencies.fetching = undefined // Remove fetching because it can cause trouble
		return {
			...state,
			...action.payload.agencies,
			items: {
				...mapItems(action.payload.agencies.items, agency => new Agency(agency, agency.serverID)),
			},
			activated: action.payload.agencies.activated.concat(state.activated),
			activatedTypes: action.payload.agencies.activatedTypes.concat(state.activatedTypes),
		}
	default:
		return state
	}
}
