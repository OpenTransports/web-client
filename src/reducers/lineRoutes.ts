import { REHYDRATE } from 'redux-persist/constants'

import { LineRoute, Normalized, mapItems } from '../models'
import {
	RECEIVE_LINE_ROUTE, REQUEST_LINE_ROUTE,
	lineRoutesActions
} from '../actions'


// STATE TYPE
export type LinesRoutesState = {
	items   : Normalized<LineRoute>
	fetching: number
}


// DEFAULT STATE
const defaultState: LinesRoutesState = {
	items   : {},
	fetching: 0,
}


// REDUCERS
export function linesRoutes(state = defaultState, action: lineRoutesActions): LinesRoutesState {
	switch (action.type) {
	case RECEIVE_LINE_ROUTE:
		if (action.lineRoute == undefined) {
			return {
				...state,
				fetching: state.fetching - 1, 
			}
		}
		return {
			...state,
			fetching: state.fetching - 1,
			items: {
				...state.items,
				[action.lineRoute.id]: action.lineRoute,
			},
		}
	case REQUEST_LINE_ROUTE:
		return {
			...state,
			fetching: state.fetching + 1,
		}
	case REHYDRATE:
		if (action.payload.linesRoutes === undefined) {
			return state
		}
		delete action.payload.linesRoutes.fetching // Remove fetching because it can cause trouble
		return {
			...state,
			...action.payload.linesRoutes,
			items: {
				...mapItems(action.payload.linesRoutes.items, lineRoute => new LineRoute(lineRoute)),
			},
		}
	default:
		return state
	}
}
