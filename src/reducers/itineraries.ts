import { Itinerary, Normalized } from '../models'
import {
	RECEIVE_ITINERARY, DISPLAY_ITINERARY,
	itinerariesActions
} from '../actions'


// STATE TYPE
export type ItinerariesState = {
	display: string
	items  : Normalized<Itinerary>
}


// DEFAULT STATE
const defaultState: ItinerariesState = {
	display: null,
	items  : {},
}


// REDUCERS
export function itineraries(state = defaultState, action: itinerariesActions): ItinerariesState {
	switch (action.type) {
	case RECEIVE_ITINERARY:
		const hash = `${action.itinerary.from.latitude}${action.itinerary.from.longitude}${action.itinerary.to.latitude}${action.itinerary.to.longitude}`
		return {
			...state,
			items: {
				...state.items,
				[hash]: action.itinerary,
			},
		}
	case DISPLAY_ITINERARY:
		return {
			...state,
			display: action.hash
		}
	default:
		return state
	}
}
