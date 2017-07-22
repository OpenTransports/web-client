// TYPES
export const TOGGLE_MENU = 'TOGGLE_MENU'
export const TOGGLE_MAP  = 'TOGGLE_MAP'

export type DrawersAction = {
	type: 'TOGGLE_MENU' | 'TOGGLE_MAP',
}

// CREATORS
export function toggleMenu(): DrawersAction {
	return { type: TOGGLE_MENU }
}

export function toggleMap(): DrawersAction {
	return { type: TOGGLE_MAP }
}
