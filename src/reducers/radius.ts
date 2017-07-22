import {
	UPDATE_RADIUS,
	radiusActions
} from '../actions'


// STATE TYPE
export type RadiusState = number


// DEFAULT STATE
const defaultState: RadiusState = 200


// REDUCERS
export function radius(state = defaultState, action: radiusActions): RadiusState {
	switch (action.type) {
	case UPDATE_RADIUS:
		return action.radius
	default:
		return state
	}
}
