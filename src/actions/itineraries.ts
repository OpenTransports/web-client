import { Dispatch } from 'react-redux'

import { RootState } from '../reducers/configureStore'
import { Position, Itinerary } from '../models'


// TYPES
export const RECEIVE_ITINERARY = 'RECEIVE_ITINERARY'
export const DISPLAY_ITINERARY = 'DISPLAY_ITINERARY'

type receiveItinerary = {
	type : 'RECEIVE_ITINERARY'
	itinerary: Itinerary
}

type displayItinerary = {
	type: 'DISPLAY_ITINERARY'
	hash: string
}

export type itinerariesActions =
	receiveItinerary |
	displayItinerary


// CREATORS
function receiveItinerary(itinerary: Itinerary): receiveItinerary {
	return {
		type: RECEIVE_ITINERARY,
		itinerary,
	}
}

function displayItinerary(hash: string): displayItinerary {
	return {
		type: DISPLAY_ITINERARY,
		hash,
	}
}


// FUNCTIONS
// TODO - the demo server of osrm only server driving itineraries. We need to set up our own routing server
const API_URL = "https://itineraryr.project-osrm.org/itinerary/v1/foot"
export function getItinerary(from: Position, to: Position) {
	return async (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const { itineraries } = getState()
		const hash = `${from.latitude}${from.longitude}${to.latitude}${to.longitude}`

		dispatch(displayItinerary(hash))

		if (itineraries[hash] === undefined) {
			const REQUEST_URL = `${API_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?geometries=geojson`
			const response = (await (await fetch(REQUEST_URL)).json()) as any
			dispatch(receiveItinerary(new Itinerary(from, to, response.itineraries[0])))
		} else {
			dispatch(receiveItinerary(itineraries[hash]))
		}
	}
}
