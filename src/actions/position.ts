import { Dispatch } from 'react-redux'

import { Position } from '../models'
import { fetchTransports } from './transports'
import { fetchAgencies } from './agencies'
import { OTState } from '../reducers/opentransports'

// ACTION TYPES
export type UPDATE_POSITION = 'UPDATE_POSITION'
export const UPDATE_POSITION: UPDATE_POSITION = "UPDATE_POSITION"

export type PositionOtherAction = { type: '' }
export const PositionOtherAction : PositionOtherAction = { type: '' }


// INTERFACES
export type UpdatePositionAction = {
	type: UPDATE_POSITION,
	position: Position
}

export type PositionAction =
	UpdatePositionAction |
	PositionOtherAction


// ACTIONS OBJECTS BUILDERS
function updatePosition(p: Position): PositionAction {
	return {
		type: UPDATE_POSITION,
		position: p,
	}
}

// ACTIONS FUNCTION
export function watchPosition() {
	return (dispatch: Dispatch<{}>, getState: () => OTState ) => {
		navigator.geolocation.watchPosition(location => {
			const oldState = getState()
			// Mock user position during dev
			// Can be change by creating an .env file (see .env.example)
			const newPosition = new Position(MOCK_POSITION || location.coords)
			dispatch(updatePosition(newPosition))
			if (newPosition.distanceFrom(oldState.agencies.lastUpdated.position) > 50 ||
				oldState.agencies.lastUpdated.date - Date.now() > 2*60*1000) {
				dispatch(fetchTransports(newPosition))
			}
			if (newPosition.distanceFrom(oldState.transports.lastUpdated.position) > 50 ||
				oldState.transports.lastUpdated.date - Date.now() > 2*60*1000) {
				dispatch(fetchAgencies(newPosition))
			}
		})
	}
}
