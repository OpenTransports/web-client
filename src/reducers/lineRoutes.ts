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
		return {
			...state,
			fetching: state.fetching--,
			items: {
				...state.items,
				[action.lineRoute.id]: action.lineRoute,
			},
		}
	case REQUEST_LINE_ROUTE:
		return {
			...state,
			fetching: state.fetching++,
			items: {
				...state.items,
				[action.lineID]: {
					...state.items[action.lineID],
				},
			},
		}
	case REHYDRATE:
		if (action.payload.linesRoutes === undefined) {
			return state
		}
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
