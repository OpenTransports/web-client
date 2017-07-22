export type Normalized<T> = { [name: string]: T}
type IDable = { ID: string }

export function filterItems<T extends IDable>(items: Normalized<T>, fn: (T) => boolean): string[] {
	return Object.keys(items).filter(itemID => fn(items[itemID]) )
}


export function normalizeArray<T extends IDable>(array: T[]): Normalized<T> {
	return array.reduce(((itemByID, item)=> {
		itemByID[item.ID] = item
		return itemByID
	}), {})
}


export function toggleItem(array: string[], item: string): string[] {
	const index = array.indexOf(item)
	if (index == -1) {
		return [ ...array.slice(), item ]
	} else {
		return [ ...array.slice(0, index), ...array.slice(index + 1) ]
	}
}
