import { Route } from '../models'
import { Normalized } from './'
import {
	RECEIVE_ROUTE, DISPLAY_ROUTE,
	routesActions
} from '../actions'


// STATE TYPE
export type RoutesState = {
	display: string
	items  : Normalized<Route>
}


// DEFAULT STATE
const defaultState: RoutesState = {
	display: null,
	items  : {},
}


// REDUCERS
export function routes(state = defaultState, action: routesActions): RoutesState {
	switch (action.type) {
	case RECEIVE_ROUTE:
		const hash = `${action.route.from.latitude}${action.route.from.longitude}${action.route.to.latitude}${action.route.to.longitude}`
		return {
			...state,
			items: {
				...state.items,
				[hash]: action.route,
			},
		}
	case DISPLAY_ROUTE:
		return {
			...state,
			display: action.hash
		}
	default:
		return state
	}
}
