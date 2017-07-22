import { Normalized, normalizeArray, toggleItem } from './normalize'

import { Position, Server } from '../models'

import { TOGGLE_SERVER, serversActions, UPDATE_RADIUS, radiusActions } from '../actions'

import rawServerList from './serversList.json'

// STATE TYPE
export type ServersState = {
	items    : Normalized<Server>
	activated: string[]
}


// DEFAULT STATE
const defaultState: ServersState = {
	items    : normalizeArray(rawServerList.map(server => new Server(server))),
	activated: [] as string[],
}


// REDUCERS
export function servers(state = defaultState, action: serversActions | radiusActions): ServersState {
	switch (action.type) {
	case TOGGLE_SERVER:
		return {
			...state,
			activated: toggleItem(state.activated, action.serverID)
		}
	default:
		return state
	}
}
