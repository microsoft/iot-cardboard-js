/**
 * This context is for transferring state from one session to another. These properties are managed by the various parts of the app and can be read onMount to restore the state
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import {
    deepCopy,
    getDebugLogger
} from '../../../../../../Models/Services/Utils';
import {
    IBehaviorFormContext,
    IBehaviorFormContextState,
    BehaviorFormContextAction,
    BehaviorFormContextActionType,
    IBehaviorFormContextProviderProps
} from './BehaviorFormContext.types';
import {
    AddOrUpdateVisualByFilter,
    AddOrUpdateWidgetByFilter,
    RemoveAllExpressionRangeVisualsByFilter,
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
            `Updating BehaviorForm context ${action.type} with payload: `,
            (action as any).payload // ignore that payload doesn't always come since this is just a log
        );
        switch (action.type) {
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE: {
                AddOrUpdateVisualByFilter(
                    draft.behaviorToEdit,
                    action.payload.visual,
                    ViewerConfigUtility.isAlertVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE: {
                RemoveAllExpressionRangeVisualsByFilter(
                    draft.behaviorToEdit,
                    ViewerConfigUtility.isAlertVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_ADD_OR_UPDATE: {
                AddOrUpdateVisualByFilter(
                    draft.behaviorToEdit,
                    action.payload.visual,
                    ViewerConfigUtility.isStatusColorVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_STATUS_VISUAL_REMOVE: {
                RemoveAllExpressionRangeVisualsByFilter(
                    draft.behaviorToEdit,
                    ViewerConfigUtility.isStatusColorVisual,
                    logDebugConsole
                );
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE: {
                // we assume there is only one popover
                const draftVisual = draft.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isPopoverVisual
                )[0];
                if (!draftVisual) {
                    logDebugConsole(
                        'warn',
                        'Unable to add widget to behavior. Popover visual not found. {visuals}',
                        draft.behaviorToEdit?.visuals
                    );
                    break;
                }

                AddOrUpdateWidgetByFilter(
                    draftVisual,
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
                break;
            }
        }
    }
);

export const BehaviorFormContextProvider: React.FC<IBehaviorFormContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useBehaviorFormContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { behaviorToEdit } = props;
    const defaultState: IBehaviorFormContextState = {
        behaviorToEdit: behaviorToEdit,
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
