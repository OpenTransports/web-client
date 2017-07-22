import { Dispatch } from 'react-redux'

import  { OTState } from '../reducers/opentransports'
import { fetchTransports } from './transports'
import { fetchAgencies } from './agencies'

export const UPDATE_RADIUS = 'UPDATE_RADIUS'

// TYPES
export type RadiusAction = {
	type: 'UPDATE_RADIUS',
	radius: number,
}

// CREATORS
function updateRadius(radius: number): RadiusAction {
	return {
		type: UPDATE_RADIUS,
		radius: radius,
	}
}

// FUNCTION
export function changeRadius(newRadius: number) {
	return (dispatch: Dispatch<{}>, getState: () => OTState) => {
		const { radius , position } = getState()
		dispatch(updateRadius(newRadius))
		if (newRadius > radius) {
			dispatch(fetchTransports(position))
			dispatch(fetchAgencies(position))
		}
	}
}
