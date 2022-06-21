import { defaultBehavior } from '../../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import { IConsoleLogFunction } from '../../../../../../Models/Constants/Types';
import { createGUID, deepCopy } from '../../../../../../Models/Services/Utils';
import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IBehaviorFormContextState } from './BehaviorFormContext.types';

/**
 * Looks at the state and determines whether anything has been changed
 * @param state the current state of the form
 * @param originalBehavior the behavior that the form was initialized with
 * @param originalLayers the list of layers that the form was initialized with
 * @returns boolean indicating whether anything has been changed
 */
export function isStateDirty(
    state: IBehaviorFormContextState,
    originalBehavior: IBehavior,
    originalLayers: string[],
    logger: IConsoleLogFunction
): boolean {
    const newBehavior = state.behaviorToEdit;
    const newLayers = state.behaviorSelectedLayerIds;

    const hasBehaviorChanged =
        JSON.stringify(newBehavior) !== JSON.stringify(originalBehavior);
    const hasLayersChanged =
        JSON.stringify(newLayers) !== JSON.stringify(originalLayers);

    const isDirty = hasBehaviorChanged || hasLayersChanged;
    logger(
        'debug',
        `IsFormDirty: ${isDirty}. BehaviorDirty: ${hasBehaviorChanged}, LayersDirty: ${hasLayersChanged}`
    );

    return isDirty;
}

export function CreateNewBehavior(): IBehavior {
    return { ...defaultBehavior, id: createGUID() };
}

/**
 * Removes a widget with the given id from a behavior.
 * @param behavior behavior object to update
 * @param widgetId the id of the widget to remove
 * @param logger console logger to debugging
 * @returns void
 */
export function RemoveWidgetFromBehaviorById(
    behavior: IBehavior,
    widgetId: string,
    logger: IConsoleLogFunction
): void {
    logger(
        'debug',
        `[START] Removing widget (id: ${widgetId}) from behavior. {behaviorToEdit}`,
        behavior
    );
    // we assume there is only one popover
    const draftVisual = behavior.visuals.filter(
        ViewerConfigUtility.isPopoverVisual
    )[0];
    if (!draftVisual) {
        logger(
            'warn',
            '[END] Removing widget id. Unable to remove widget from behavior. Popover visual not found. {visuals}',
            behavior.visuals
        );
        return;
    }
    RemoveItemsFromListByFilter(
        draftVisual.widgets,
        (x) => x.id === widgetId,
        logger
    );
}

/**
 * Removes all the items from a list taht match the provided predicate
 * @param items list of items to search and update
 * @param predicate criteria for matching visuals to remove
 * @param logger console logger to debugging
 * @returns void
 */
export function RemoveItemsFromListByFilter<T>(
    items: T[],
    predicate: (value: T) => boolean,
    logger: IConsoleLogFunction
): boolean {
    let result = false;
    logger(
        'debug',
        '[START] Removing item from list. {items.length}',
        items?.length
    );
    // get all items that match
    const matchedItems = items?.filter(predicate);

    if (!matchedItems?.length) {
        logger(
            'warn',
            'Unable to remove item from list. No item found that matches the predicate. {items}',
            items
        );
        return result;
    }
    // remove each from the array
    matchedItems.forEach((item) => {
        const index = items.indexOf(item);
        if (index >= 0) {
            result = true;
            items.splice(index, 1);
        }
    });

    logger(
        'debug',
        '[END] Removing item from list. {items.length}',
        items.length
    );
    return result;
}

/**
 * Adds or updates the provided item to the given list of items
 * @param listItems List of items to search over
 * @param itemToAddUpdate item to add or replace
 * @param predicate filter for finding the right item to replace
 * @param logger console logger to debugging
 */
export function AddOrUpdateListItemByFilter<T>(
    listItems: T[],
    itemToAddUpdate: T,
    predicate: (value: T) => boolean,
    logger: IConsoleLogFunction
): boolean {
    let result = false;
    logger(
        'debug',
        '[START] Add/Update item in list. {listItems.length, item}',
        listItems?.length,
        itemToAddUpdate
    );
    if (!listItems) {
        listItems = [];
    }

    const index = listItems.findIndex(predicate);
    if (index < 0) {
        logger('debug', `Adding new item.`);
        // add
        listItems.push(deepCopy(itemToAddUpdate));
        result = true;
    } else {
        // update
        logger('debug', `Updating item at index ${index}.`);
        listItems[index] = deepCopy(itemToAddUpdate);
        result = true;
    }

    logger(
        'debug',
        '[END] Add/Update item in list. {listItems.length}',
        listItems?.length
    );
    return result;
}
