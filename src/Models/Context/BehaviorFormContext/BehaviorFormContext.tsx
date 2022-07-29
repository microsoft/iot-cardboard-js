/**
 * This context is for managing the state of creating and editing a behavior object
 */
import produce, { current } from 'immer';
import React, { useContext, useReducer } from 'react';
import { defaultOnClickPopover } from '../../Classes/3DVConfig';
import ViewerConfigUtility from '../../Classes/ViewerConfigUtility';
import { deepCopy, getDebugLogger } from '../../Services/Utils';
import { IBehavior } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IBehaviorFormContext,
    IBehaviorFormContextState,
    BehaviorFormContextAction,
    BehaviorFormContextActionType,
    IBehaviorFormContextProviderProps
} from './BehaviorFormContext.types';
import {
    AddOrUpdateListItemByFilter,
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
                draft.behaviorToEdit.visuals = AddOrUpdateListItemByFilter(
                    draft.behaviorToEdit.visuals,
                    action.payload.visual,
                    ViewerConfigUtility.isAlertVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE: {
                draft.behaviorToEdit.visuals = RemoveItemsFromListByFilter(
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
                draft.behaviorToEdit.datasources = AddOrUpdateListItemByFilter(
                    draft.behaviorToEdit.datasources,
                    action.payload.source,
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource,
                    logDebugConsole
                );

                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE: {
                draft.behaviorToEdit.datasources = RemoveItemsFromListByFilter(
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
            case BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD: {
                const set = new Set<string>(draft.behaviorSelectedLayerIds);
                set.add(action.payload.layerId);
                draft.behaviorSelectedLayerIds = Array.from(set);
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE: {
                const set = new Set<string>(draft.behaviorSelectedLayerIds);
                set.delete(action.payload.layerId);
                draft.behaviorSelectedLayerIds = Array.from(set);
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
                draft.behaviorToEdit.visuals = AddOrUpdateListItemByFilter(
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
                statusVisual.valueRanges = action.payload.ranges || [];
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_REMOVE: {
                draft.behaviorToEdit.visuals = RemoveItemsFromListByFilter(
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
                    draft.behaviorToEdit.visuals = AddOrUpdateListItemByFilter(
                        draft.behaviorToEdit.visuals,
                        defaultOnClickPopover,
                        () => false,
                        logDebugConsole
                    );
                    draftPopover = draft.behaviorToEdit.visuals.filter(
                        ViewerConfigUtility.isPopoverVisual
                    )[0];
                }

                draftPopover.widgets = AddOrUpdateListItemByFilter(
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
                draft.behaviorToEdit.visuals = RemoveItemsFromListByFilter(
                    draft.behaviorToEdit.visuals,
                    (visual) =>
                        ViewerConfigUtility.isPopoverVisual(visual) &&
                        !visual.widgets?.length,
                    logDebugConsole
                );
                break;
            }
        }

        // check for changes after every action
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

    // TODO: remove this copy when we turn off auto freeze
    const defaultState: IBehaviorFormContextState = {
        behaviorToEdit: deepCopy(behaviorToEdit),
        behaviorSelectedLayerIds: deepCopy(behaviorSelectedLayerIds),
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
