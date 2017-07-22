import { Position } from '../models'

import { UPDATE_POSITION, positionActions } from '../actions'


// STATE TYPE
export type PositionState = Position


// DEFAULT STATE
const defaultState: PositionState = new Position()


// REDUCERS
export function userPosition(state = defaultState, action: positionActions): PositionState {
	switch (action.type) {
	case UPDATE_POSITION:
		return action.position
	default:
		return state
	}
}
