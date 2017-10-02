import { REHYDRATE } from 'redux-persist/constants'

import {
	UPDATE_RADIUS,
	radiusActions
} from '../actions'


// STATE TYPE
export type RadiusState = number


// DEFAULT STATE
const defaultState: RadiusState = 500


// REDUCERS
export function radius(state = defaultState, action: radiusActions): RadiusState {
	switch (action.type) {
	case UPDATE_RADIUS:
		return action.radius
	case REHYDRATE:
		if (action.payload.agencies === undefined) {
			return state
		}
		return action.payload.radius
	default:
		return state
	}
}
