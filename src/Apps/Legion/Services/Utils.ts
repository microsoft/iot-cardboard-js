import { v4 } from 'uuid';

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
    if (isDefined(item) && index > -1) {
        collection[index] = item;
        success = true;
    }

    return success;
}

/** takes a collection and an item and finds the index of that item in the collection and replaces it with the item provided. If it is not found, it will create the item */
export function replaceOrAddItem<T extends { id: string }>(
    item: T,
    collection: T[]
): boolean {
    let success = false;
    success = replaceItem(item, collection);
    if (!success) {
        success = addItem(item, collection);
    }

    return success;
}

/** takes a collection and adds the item if it is not undefined/null and an item does not already exist with the same id*/
export function addItem<T extends { id: string }>(
    item: T,
    collection: T[]
): boolean {
    let success = false;
    // only add if defined and an item doesn't exist with the same id
    if (isDefined(item) && findIndexById(item.id, collection) === -1) {
        collection.push(item);
        success = true;
    }

    return success;
}

/** returns true if the value is NOT `undefined` OR `null` */
export function isDefined(item: any): boolean {
    return item !== null && item !== undefined;
}

/** creates a unique identifier GUID with or without dashes */
export const createGuid = (isWithDashes = false) => {
    let id: string = v4();
    if (!isWithDashes) {
        id = id.replace(/-/g, '');
    }
    return id;
};

export const getColorByIdx = (idx: number): string => {
    const colors = [
        '#2caffe',
        '#544fc5',
        '#00e272',
        '#fe6a35',
        '#6b8abc',
        '#d568fb',
        '#2ee0ca',
        '#fa4b42',
        '#feb56a',
        '#91e8e12'
    ];
    return colors[idx % colors.length];
};
