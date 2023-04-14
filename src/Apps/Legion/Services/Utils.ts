/** takes a collection and id and finds an element in that collection with the matching id */
export function getItemById<T extends { id: string }>(
    id: string,
    collection: T[]
): T {
    return collection.find((x) => x.id === id);
}

/** takes a collection and id and finds the index of an element in that collection with the matching id */
export function getIndexById<T extends { id: string }>(
    id: string,
    collection: T[]
): number {
    return collection.findIndex((x) => x.id === id);
}

/** takes a collection and id and filters out any element in that collection with the matching id */
export function filterItemsById<T extends { id: string }>(
    id: string,
    collection: T[]
): T[] {
    return collection.filter((x) => x.id !== id);
}
