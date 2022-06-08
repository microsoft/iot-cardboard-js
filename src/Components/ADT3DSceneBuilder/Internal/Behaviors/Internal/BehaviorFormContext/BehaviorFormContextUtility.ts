import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import { IConsoleLogFunction } from '../../../../../../Models/Constants/Types';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import {
    IBehavior,
    IExpressionRangeVisual,
    IPopoverVisual,
    IVisual,
    IWidget
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

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
    logger('debug', '[START] Removing item from list. {items}', items);
    // get all items that match
    const matchedItems = items.filter(predicate);

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
        if (index > 0) {
            result = true;
            items.splice(index, 1);
        }
    });

    logger('debug', '[END] Removing item from list. {items}', items);
    return result;
}

/**
 * Adds or updates the provided widget to the given popover visual
 * @param popoverVisual Visual to update
 * @param itemToAddUpdate Widget to add or replace
 * @param predicate filter for finding the right widget to replace
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
        '[START] Add/Update item in list. {listItems, item}',
        listItems,
        itemToAddUpdate
    );
    if (!listItems?.length) {
        listItems = [];
    }

    const draftExistingVisualIndex = listItems.findIndex(predicate)[0];

    // update
    if (draftExistingVisualIndex > 0) {
        logger(
            'debug',
            `Updating item at index ${draftExistingVisualIndex}. {item}`,
            itemToAddUpdate
        );
        listItems[draftExistingVisualIndex] = deepCopy(itemToAddUpdate);
        result = true;
    } else {
        logger('debug', `Adding item. {item}`, itemToAddUpdate);
        // add
        listItems.push(deepCopy(itemToAddUpdate));
        result = true;
    }

    logger(
        'debug',
        '[END] Add/Update item in list. {listItems, item}',
        listItems,
        itemToAddUpdate
    );
    return result;
}
