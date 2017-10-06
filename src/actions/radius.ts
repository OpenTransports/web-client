import { Dispatch } from 'react-redux'
import { REHYDRATE } from 'redux-persist/constants'

import { RootState } from '../reducers/configureStore'
import { fetchTransports, redrawTransports } from '.'

// TYPES
export const UPDATE_RADIUS = 'UPDATE_RADIUS'

export type radiusActions = {
	type: 'UPDATE_RADIUS'
	radius: number
} | { type: 'persist/REHYDRATE', payload: any, error: any }


// CREATORS
function updateRadius(radius: number): radiusActions {
	return {
		type: UPDATE_RADIUS,
		radius,
	}
}


// FUNCTIONS
// 1. Dispatch a updateRadius action
// 2. If the new radius is bigger than the old radius, refetch transports and agencies list
// @param newRadius <number> the new radius
export function changeRadius(newRadius: number) {
	return (dispatch: Dispatch<{}>, getState: () => RootState) => {
		const { radius , userPosition, agencies } = getState()

		dispatch(updateRadius(newRadius))
		dispatch(redrawTransports(agencies, userPosition, newRadius))

		if (newRadius > radius) {
			dispatch(fetchTransports())
		}
	}
}
