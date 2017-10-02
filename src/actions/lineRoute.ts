import { Dispatch } from 'react-redux'
import { REHYDRATE } from 'redux-persist/constants'

import { RootState } from '../reducers/configureStore'
import { Position, Transport, LineRoute } from '../models'


// TYPES
export const REQUEST_LINE_ROUTE = 'REQUEST_LINE_ROUTE'
export const RECEIVE_LINE_ROUTE = 'RECEIVE_LINE_ROUTE'

type requestLineRoute = {
	type  : 'REQUEST_LINE_ROUTE'
	lineID: string
}

type receiveLineRoute = {
	type     : 'RECEIVE_LINE_ROUTE'
	lineRoute: LineRoute
}

export type lineRoutesActions =
    requestLineRoute |
	receiveLineRoute |
	{ type: 'persist/REHYDRATE', payload: any, error: any }


// CREATORS
function receiveLineRoute(lineRoute: LineRoute): receiveLineRoute {
	return {
		type: RECEIVE_LINE_ROUTE,
		lineRoute,
	}
}

function requestLineRoute(lineID: string): requestLineRoute {
	return {
		type: REQUEST_LINE_ROUTE,
		lineID,
	}
}


// FUNCTIONS
export function getLineRouteForTransport(transport: Transport) {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const { linesRoutes, agencies, servers } = getState()

		if (linesRoutes.items[transport.line] !== undefined) {
			return
		}

		dispatch(requestLineRoute(transport.line))

		const agency = agencies.items[transport.agencyID]
		const server = servers.items[agency.serverID]

		const response = (await (await fetch(`${server.url}/transports/${transport.id}/route`)).json()) as any
		dispatch(receiveLineRoute(new LineRoute(response)))
	}
}
