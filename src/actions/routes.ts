import { Dispatch } from 'react-redux'

import { RootState } from '../reducers/configureStore'
import { Position, Route } from '../models'


// TYPES
export const RECEIVE_ROUTE = 'RECEIVE_ROUTE'
export const DISPLAY_ROUTE = 'DISPLAY_ROUTE'

type receiveRoute = {
	type : 'RECEIVE_ROUTE'
	route: Route
}

type displayRoute = {
	type: 'DISPLAY_ROUTE'
	hash: string
}

export type routesActions =
	receiveRoute |
	displayRoute


// CREATORS
function receiveRoute(route: Route): receiveRoute {
	return {
		type: RECEIVE_ROUTE,
		route,
	}
}

function displayRoute(hash: string): displayRoute {
	return {
		type: DISPLAY_ROUTE,
		hash,
	}
}


// FUNCTIONS
// 1. Dispatch a updateRadius action
// 2. If the new radius is bigger than the old radius, refetch transports and agencies list
// @param newRadius <number> the new radius
// TODO - the demo server of osrm only server driving routes. We need to set up out own routing server 
const API_URL = "https://router.project-osrm.org/route/v1/foot"
export function getRoute(from: Position, to: Position) {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const { routes } = getState()
		const hash = `${from.latitude}${from.longitude}${to.latitude}${to.longitude}`

		dispatch(displayRoute(hash))

		if (routes[hash] === undefined) {
			const REQUEST_URL = `${API_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?geometries=geojson`
			const response = (await (await fetch(REQUEST_URL)).json()) as any
			dispatch(receiveRoute(new Route(from, to, response.routes[0])))
		} else {
			dispatch(receiveRoute(routes[hash]))
		}
	}
}
