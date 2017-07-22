import {
	TOGGLE_MENU, TOGGLE_MAP,
	DrawersAction,
} from '../actions'


// STATE TYPE
export type DrawersState = {
	menuIsOpen : boolean,
	mapIsOpen  : boolean,
}

// DEFAULT STATE
const defaultState: DrawersState = {
	menuIsOpen : false,
	mapIsOpen  : false,
}

// REDUCERS
export function drawers(state = defaultState, action: DrawersAction): DrawersState {
	switch (action.type) {
	case TOGGLE_MENU:
		return {
			...state,
			menuIsOpen: !state.menuIsOpen,
		}
	case TOGGLE_MAP:
		return {
			...state,
			mapIsOpen: !state.mapIsOpen,
		}
	default:
		return state
}
}
