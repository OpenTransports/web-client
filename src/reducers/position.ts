import { Position } from '../models'

import { UPDATE_POSITION, PositionAction } from '../actions'


// TRANSPORTS STATE INTERFACE
export type PositionState = Position


// DEFAULT STATE
const defaultState: PositionState = new Position()


// REDUCER
export function position(state = defaultState, action: PositionAction): PositionState {
	switch (action.type) {
		case UPDATE_POSITION:
			return action.position
		default:
			return state
	}
}
