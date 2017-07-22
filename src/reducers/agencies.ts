import { Position, Agency } from '../models'

import {
	REQUEST_AGENCIES, RECEIVE_AGENCIES, TOGGLE_AGENCY,
	AgencyAction
} from '../actions'


// AGENCIES STATE INTERFACE
export interface AgenciesState {
	isFetching       : boolean,
	items            : Array<Agency>,
	selectedAgencies : {[name: string]: boolean},
	lastUpdated      : { date: number, position: Position },
}


// DEFAULT STATE
const defaultState: AgenciesState = {
	isFetching       : false,
	items            : [] as Array<Agency>,
	selectedAgencies : {},
	lastUpdated      : { date: 0, position: new Position() },
}


// REDUCERS
export function agencies(state = defaultState, action: AgencyAction): AgenciesState {
	switch (action.type) {
		case REQUEST_AGENCIES:
			return {
				...state,
				isFetching: true,
			}
		case RECEIVE_AGENCIES:
			return {
				...state,
				items: action.agencies,
				selectedAgencies: action.agencies.reduce(function(sa, a){
					sa[a.ID] = sa[a.ID] != undefined ? sa[a.ID] : true
					return sa
				}, state.selectedAgencies),
				lastUpdated: { date: action.receivedAt, position: action.receivedPos },
				isFetching: false,
			}
		case TOGGLE_AGENCY:
			return {
				...state,
				selectedAgencies: {
					...state.selectedAgencies,
					[action.agencyID]: !state.selectedAgencies[action.agencyID],
				}
			}
		default:
			return {...state}
	}
}
