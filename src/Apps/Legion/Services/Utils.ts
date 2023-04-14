/** takes a collection and id and finds an element in that collection with the matching id */
export function findItemById<T extends { id: string }>(
    id: string,
    collection: T[]
): T {
    return collection.find((x) => x.id === id);
}

/** takes a collection and id and finds the index of an element in that collection with the matching id */
export function findIndexById<T extends { id: string }>(
    id: string,
    collection: T[]
): number {
    return collection.findIndex((x) => x.id === id);
}

/** takes a collection and id and filters out any element in that collection with the matching id */
export function removeItemById<T extends { id: string }>(
    id: string,
    collection: T[]
): boolean {
    let success = false;
    const index = findIndexById(id, collection);
    if (index > -1) {
        collection.splice(index, 1);
        success = true;
    }

    return success;
}

/** takes a collection and an item and finds the index of that item in the collection and replaces it with the item provided */
export function replaceItem<T extends { id: string }>(
    item: T,
    collection: T[]
): boolean {
    let success = false;
    const index = findIndexById(item.id, collection);
    if (index > -1) {
        collection[index] = item;
        success = true;
    }

    return success;
}
