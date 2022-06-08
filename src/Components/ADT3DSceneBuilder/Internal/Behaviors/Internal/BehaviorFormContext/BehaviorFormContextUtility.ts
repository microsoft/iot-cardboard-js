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
    if (!draftVisual?.widgets?.length) {
        logger(
            'warn',
            '[END] Removing widget id. Unable to remove widget from behavior. No widgets found. {behaviorToEdit}',
            behavior
        );
        return;
    }

    const widgetIndexToRemove = draftVisual.widgets.findIndex(
        (x) => x.id === widgetId
    );
    if (widgetIndexToRemove > 0) {
        draftVisual.widgets.splice(widgetIndexToRemove, 1);
        logger(
            'debug',
            `[END] Removing widget id. Success. {visuals}`,
            draftVisual
        );
    } else {
        logger(
            'warn',
            `[END] Removing widget id. Unable to remove widget from behavior. Widget not found with id ${widgetId}. {popoverVisual.widgets}`,
            draftVisual.widgets
        );
    }
}

/**
 * Removes all the expression range visuals on a behavior that match the provided predicate
 * @param behavior behavior object to update
 * @param predicate criteria for matching visuals to remove
 * @param logger console logger to debugging
 * @returns void
 */
export function RemoveAllExpressionRangeVisualsByFilter(
    behavior: IBehavior,
    predicate: (value: IVisual) => value is IExpressionRangeVisual,
    logger: IConsoleLogFunction
): void {
    logger(
        'debug',
        '[START] Removing visual from behavior. {behaviorToEdit}',
        behavior
    );
    // get all visuals of the type
    const visuals = behavior.visuals.filter(predicate); // NOTE: there should only be one, but building resilience

    if (!visuals?.length) {
        logger(
            'warn',
            'Unable to remove visual from behavior. No visuals of that type found. {behaviorToEdit}',
            behavior
        );
        return;
    }
    // remove each from the array
    visuals.forEach((item) => {
        const index = behavior.visuals.indexOf(item);
        if (index > 0) {
            behavior.visuals.splice(index, 1);
        }
    });

    logger(
        'debug',
        '[END] Removing visual from behavior. {behaviorToEdit}',
        behavior
    );
}

/**
 * Adds or updates the provided widget to the given popover visual
 * @param popoverVisual Visual to update
 * @param widgetToAddUpdate Widget to add or replace
 * @param predicate filter for finding the right widget to replace
 * @param logger console logger to debugging
 */
export function AddOrUpdateWidgetByFilter(
    popoverVisual: IPopoverVisual,
    widgetToAddUpdate: IWidget,
    predicate: (value: IWidget) => boolean,
    logger: IConsoleLogFunction
): void {
    logger(
        'debug',
        '[START] Add/Update widget for behavior. {popoverVisual, widget}',
        popoverVisual,
        widgetToAddUpdate
    );
    if (!popoverVisual.widgets?.length) {
        popoverVisual.widgets = [];
    }

    const draftExistingVisualIndex = popoverVisual.widgets.findIndex(
        predicate
    )[0];

    // update
    if (draftExistingVisualIndex > 0) {
        logger(
            'debug',
            `Updating widget at index ${draftExistingVisualIndex}. {widget}`,
            widgetToAddUpdate
        );
        popoverVisual.widgets[draftExistingVisualIndex] = deepCopy(
            widgetToAddUpdate
        );
    } else {
        logger('debug', `Adding widget. {widget}`, widgetToAddUpdate);
        // add
        popoverVisual.widgets.push(deepCopy(widgetToAddUpdate));
    }

    logger(
        'debug',
        '[END] Add/Update widget from behavior. {behaviorToEdit}',
        popoverVisual
    );
}

/**
 * Adds or updates the provided visual to the behavior
 * @param behavior the behavior object to update
 * @param visualToAddUpdate the visual object to add or replace
 * @param predicate filter for finding the right visual to replace
 * @param logger console logger to debugging
 */
export function AddOrUpdateVisualByFilter(
    behavior: IBehavior,
    visualToAddUpdate: IVisual,
    predicate: (value: IVisual) => value is IExpressionRangeVisual,
    logger: IConsoleLogFunction
): void {
    logger(
        'debug',
        '[START] Add/Update visual for behavior. {behaviorToEdit, visual}',
        behavior,
        visualToAddUpdate
    );
    if (!behavior.visuals?.length) {
        behavior.visuals = [];
    }

    const draftExistingVisualIndex = behavior.visuals.findIndex(predicate)[0];

    // update
    if (draftExistingVisualIndex > 0) {
        logger(
            'debug',
            `Updating visual at index ${draftExistingVisualIndex}. {visual}`,
            visualToAddUpdate
        );
        behavior.visuals[draftExistingVisualIndex] = deepCopy(
            visualToAddUpdate
        );
    } else {
        logger('debug', `Adding visual. {visual}`, visualToAddUpdate);
        // add
        behavior.visuals.push(deepCopy(visualToAddUpdate));
    }

    logger(
        'debug',
        '[END] Add/Update visual from behavior. {behaviorToEdit}',
        behavior
    );
}
