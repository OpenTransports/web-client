export type Normalized<T> = { [name: string]: T}
type IDable = { id: string }

export function filterItems<T extends IDable>(items: Normalized<T>, fn: (T) => boolean): string[] {
	return Object.keys(items).filter(itemID => fn(items[itemID]))
}


export function mapItems<T extends IDable>(items: Normalized<T>, fn: (T) => T): Normalized<T> {
	Object.keys(items).forEach(itemID => items[itemID] = fn(items[itemID]))
	return items
}


export function normalizeArray<T extends IDable>(array: T[]): Normalized<T> {
	return array.reduce(((itemByID, item)=> {
		itemByID[item.id] = item
		return itemByID
	}), {})
}


export function toggleItem<T>(array: T[], item: T): T[] {
	const index = array.indexOf(item)
	if (index == -1) {
		return [ ...array.slice(), item ]
	} else {
		return [ ...array.slice(0, index), ...array.slice(index + 1) ]
	}
}
