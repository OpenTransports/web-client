import { Dispatch } from 'react-redux'

import { Position } from '../models'
import { fetchTransports } from './transports'
import { fetchAgencies } from './agencies'
import { RootState } from '../reducers/configureStore'


// TYPES
export const UPDATE_POSITION = "UPDATE_POSITION"

export type UpdatePositionAction = {
	type    : 'UPDATE_POSITION'
	position: Position
	radius  : number
}

export type positionActions = UpdatePositionAction


// CREATORS
function updatePosition(position: Position, radius: number): positionActions {
	return {
		type: UPDATE_POSITION,
		position,
		radius,
	}
}


// FUNCTIONS
// Begin the watch the user's position
// When the position change:
// 	1. Dispatch an updatePosition action with the new position
// 	2. Refresh agencies list if:
// 		- The old and new position are more than 5 Km apart
// 	3. Refresh transports list if:
// 		- The old and new position are more than 50 m apart
// 		- The last update was more than 2 minutes ago
export function watchPosition() {
	return (dispatch: Dispatch<{}>, getState: () => RootState ) => {
		// Watch position
		navigator.geolocation.watchPosition(location => {
			const prevState = getState()

			// Mock user position during dev
			// Can be change by creating an .env file (see .env.example)
			const newPosition = new Position(MOCK_POSITION || location.coords)

			dispatch(updatePosition(newPosition, prevState.radius))

			if (newPosition.distanceFrom(prevState.agencies.lastUpdated.position) > 5000) {
				dispatch(fetchAgencies())
			}

			if (newPosition.distanceFrom(prevState.transports.lastUpdated.position) > 50 ||
				prevState.transports.lastUpdated.date - Date.now() > 2*60*1000) {
				dispatch(fetchTransports())
			}
		})

		// Watch heading
		window.ondeviceorientation = function({ absolute, gamma }) {
			if (absolute) {
				const { userPosition, radius } = getState()
				dispatch(updatePosition(new Position({ ...userPosition, heading: gamma }), radius))
			}
		}
	}
}
