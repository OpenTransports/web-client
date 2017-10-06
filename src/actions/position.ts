import { Dispatch } from 'react-redux'

import { Position } from '../models'
import { fetchTransports, fetchAgencies, redrawTransports } from '.'
import { RootState } from '../reducers/configureStore'

// TYPES
export const UPDATE_POSITION = "UPDATE_POSITION"

export type UpdatePositionAction = {
	type: 'UPDATE_POSITION'
	position: Position
}

export type positionActions = UpdatePositionAction


// CREATORS
function updatePosition(position: Position): UpdatePositionAction {
	return {
		type: UPDATE_POSITION,
		position,
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
		// window.alert("OpenTransports needs your position to work")
		// Watch position
		navigator.geolocation.watchPosition(location => {
			const { userPosition, agencies, transports } = getState()

			// Mock user position during dev
			// Can be change by creating an .env file (see .env.example)
			const newPosition = new Position(MOCK_POSITION || location.coords)

			if (newPosition.isEqual(userPosition)) {
				return
			}

			dispatch(updatePosition(newPosition))
			dispatch(redrawTransports())

			if (newPosition.distanceFrom(agencies.lastUpdated.position) > 5000) {
				dispatch(fetchAgencies())
			}

			if (newPosition.distanceFrom(transports.lastUpdated.position) > 50 ||
				transports.lastUpdated.date.getTime() - Date.now() > 2*60*1000) {
				dispatch(fetchTransports())
			}
		}, (error) => console.error(error))

		// Watch heading
		window.ondeviceorientation = function({ absolute, alpha }) {
			if (absolute) {
				const { userPosition } = getState()
				dispatch(updatePosition(new Position({ ...userPosition, heading: alpha })))
				dispatch(redrawTransports())
			}
		}
	}
}
