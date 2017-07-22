// TYPES
export const TOGGLE_SERVER = 'TOGGLE_SERVER'

type toggleServerAction = {
	type: 'TOGGLE_SERVER',
	serverID: string,
}

export type serversActions = toggleServerAction


// CREATORS
export function toggleServer(serverID: string): toggleServerAction {
	return {
		type: TOGGLE_SERVER,
		serverID: serverID,
	}
}
