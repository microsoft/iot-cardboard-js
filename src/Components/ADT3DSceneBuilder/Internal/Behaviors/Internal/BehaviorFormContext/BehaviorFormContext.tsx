/**
 * This context is for managing the state of creating and editing a behavior object
 */
import produce, { current } from 'immer';
import React, { useContext, useReducer } from 'react';
import { defaultOnClickPopover } from '../../../../../../Models/Classes/3DVConfig';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import {
    deepCopy,
    getDebugLogger
} from '../../../../../../Models/Services/Utils';
import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IBehaviorFormContext,
    IBehaviorFormContextState,
    BehaviorFormContextAction,
    BehaviorFormContextActionType,
    IBehaviorFormContextProviderProps
} from './BehaviorFormContext.types';
import {
    AddOrUpdateListItemByFilter,
    CreateNewBehavior,
    isStateDirty,
    RemoveItemsFromListByFilter,
    RemoveWidgetFromBehaviorById
} from './BehaviorFormContextUtility';

const debugLogging = false;
const logDebugConsole = getDebugLogger('BehaviorFormContext', debugLogging);

export const BehaviorFormContext = React.createContext<IBehaviorFormContext>(
    null
);
export const useBehaviorFormContext = () => useContext(BehaviorFormContext);

export const BehaviorFormContextReducer: (
    draft: IBehaviorFormContextState,
    action: BehaviorFormContextAction
) => IBehaviorFormContextState = produce(
    (draft: IBehaviorFormContextState, action: BehaviorFormContextAction) => {
        logDebugConsole(
            'info',
            `Updating BehaviorForm context ${action.type} with: {payload, behavior}`,
            (action as any).payload, // ignore that payload doesn't always come since this is just a log
            current(draft.behaviorToEdit)
        );
        switch (action.type) {
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE: {
                AddOrUpdateListItemByFilter(
                    draft.behaviorToEdit.visuals,
                    action.payload.visual,
                    ViewerConfigUtility.isAlertVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE: {
                RemoveItemsFromListByFilter(
                    draft.behaviorToEdit.visuals,
                    ViewerConfigUtility.isAlertVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD: {
                const set = new Set<string>(draft.behaviorToEdit.twinAliases);
                set.add(action.payload.alias);
                draft.behaviorToEdit.twinAliases = Array.from(set);
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE: {
                const set = new Set<string>(draft.behaviorToEdit.twinAliases);
                set.delete(action.payload.alias);
                draft.behaviorToEdit.twinAliases = Array.from(set);
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE: {
                AddOrUpdateListItemByFilter(
                    draft.behaviorToEdit.datasources,
                    action.payload.source,
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource,
                    logDebugConsole
                );

                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE: {
                RemoveItemsFromListByFilter(
                    draft.behaviorToEdit.datasources,
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET: {
                draft.behaviorToEdit.displayName = action.payload.name;
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_INITIALIZE: {
                draft.behaviorToEdit = CreateNewBehavior();
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD: {
                AddOrUpdateListItemByFilter(
                    draft.behaviorSelectedLayerIds,
                    action.payload.layerId,
                    () => false,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE: {
                RemoveItemsFromListByFilter(
                    draft.behaviorSelectedLayerIds,
                    (x) => x === action.payload.layerId,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_RESET: {
                // if given a behavior to use, use it. Otherwise fall back to the initial value given to the provider
                if (action.payload?.behavior) {
                    draft.behaviorToEdit = deepCopy(action.payload?.behavior);
                } else {
                    draft.behaviorToEdit = deepCopy(initialBehavior);
                }
                if (action.payload?.layerIds) {
                    draft.behaviorSelectedLayerIds = deepCopy(
                        action.payload?.layerIds
                    );
                } else {
                    draft.behaviorSelectedLayerIds = deepCopy(initialLayers);
                }
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE: {
                AddOrUpdateListItemByFilter(
                    draft.behaviorToEdit.visuals,
                    action.payload.visual,
                    ViewerConfigUtility.isStatusColorVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE_RANGES: {
                const statusVisual = draft.behaviorToEdit.visuals?.find(
                    ViewerConfigUtility.isStatusColorVisual
                );
                if (!statusVisual) {
                    logDebugConsole(
                        'warn',
                        'Unable to update value ranges. Status visual not found on behavior. {visuals}',
                        current(draft.behaviorToEdit?.visuals)
                    );
                    break;
                }
                statusVisual.valueRanges = action.payload.ranges;
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_REMOVE: {
                RemoveItemsFromListByFilter(
                    draft.behaviorToEdit.visuals,
                    ViewerConfigUtility.isStatusColorVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE: {
                // we assume there is only one popover
                let draftPopover = draft.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isPopoverVisual
                )[0];
                // add a popover visual if it doesn't exist
                if (!draftPopover) {
                    logDebugConsole(
                        'debug',
                        'Popover visual not found. Adding {visuals}',
                        draft.behaviorToEdit?.visuals
                    );
                    AddOrUpdateListItemByFilter(
                        draft.behaviorToEdit.visuals,
                        defaultOnClickPopover,
                        () => false,
                        logDebugConsole
                    );
                    draftPopover = draft.behaviorToEdit.visuals.filter(
                        ViewerConfigUtility.isPopoverVisual
                    )[0];
                }

                AddOrUpdateListItemByFilter(
                    draftPopover.widgets,
                    action.payload.widget,
                    (x) => x.id === action.payload.widget.id,
                    logDebugConsole
                );

                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_REMOVE: {
                RemoveWidgetFromBehaviorById(
                    draft.behaviorToEdit,
                    action.payload.widgetId,
                    logDebugConsole
                );
                // remove any popoover that doesn't have any widgets
                RemoveItemsFromListByFilter(
                    draft.behaviorToEdit.visuals,
                    (visual) =>
                        ViewerConfigUtility.isPopoverVisual(visual) &&
                        !visual.widgets?.length,
                    logDebugConsole
                );
                break;
            }
        }

        draft.isDirty = isStateDirty(
            draft,
            initialBehavior,
            initialLayers,
            logDebugConsole
        );
    }
);

let initialBehavior: IBehavior;
let initialLayers: string[];
export const BehaviorFormContextProvider: React.FC<IBehaviorFormContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useBehaviorFormContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { behaviorToEdit, behaviorSelectedLayerIds } = props;
    initialBehavior = deepCopy(behaviorToEdit);
    initialLayers = deepCopy(behaviorSelectedLayerIds);

    const defaultState: IBehaviorFormContextState = {
        behaviorToEdit: behaviorToEdit,
        behaviorSelectedLayerIds: behaviorSelectedLayerIds,
        isDirty: false
    };

    const [behaviorFormState, behaviorFormDispatch] = useReducer(
        BehaviorFormContextReducer,
        defaultState
    );
    return (
        <BehaviorFormContext.Provider
            value={{
                behaviorFormDispatch,
                behaviorFormState
            }}
        >
            {children}
        </BehaviorFormContext.Provider>
    );
};
