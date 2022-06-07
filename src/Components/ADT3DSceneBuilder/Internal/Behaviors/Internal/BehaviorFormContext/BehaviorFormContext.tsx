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
            case BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_ADD_OR_UPDATE: {
                // we assume there is only one popover
                const draftPopoverVisual = draft.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isPopoverVisual
                )[0];
                if (!draftPopoverVisual) {
                    logDebugConsole(
                        'warn',
                        'Unable to add widget to behavior. Popover visual not found. {visuals}',
                        draft.behaviorToEdit?.visuals
                    );
                    break;
                }

                const widgetToAdd = deepCopy(action.payload.widget);
                // if we already have widgets add it to the list, otherwise, create the lsit
                if (draftPopoverVisual.widgets?.length) {
                    const draftExistingWidgetIndex = draftPopoverVisual.widgets.findIndex(
                        (x) => x.id === widgetToAdd.id
                    );
                    // update
                    if (draftExistingWidgetIndex > 0) {
                        draftPopoverVisual.widgets[
                            draftExistingWidgetIndex
                        ] = widgetToAdd;
                    } else {
                        // add
                        draftPopoverVisual.widgets.push(widgetToAdd);
                    }
                } else {
                    draftPopoverVisual.widgets = [widgetToAdd];
                }
                break;
            }
            case BehaviorFormContextActionType.FORM_BEHAVIOR_WIDGET_REMOVE: {
                // we assume there is only one popover
                const popoverVisual = draft.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isPopoverVisual
                )[0];
                if (!popoverVisual) {
                    logDebugConsole(
                        'warn',
                        'Unable to remove widget from behavior. Popover visual not found. {visuals}',
                        draft.behaviorToEdit?.visuals
                    );
                    break;
                }
                if (!popoverVisual?.widgets?.length) {
                    logDebugConsole(
                        'warn',
                        'Unable to remove widget from behavior. No widgets found. {behaviorToEdit}',
                        draft.behaviorToEdit
                    );
                    break;
                }

                const widgetIdToRemove = action.payload.widgetId;
                const widgetIndexToRemove = popoverVisual.widgets.findIndex(
                    (x) => x.id === widgetIdToRemove
                );
                if (widgetIndexToRemove > 0) {
                    popoverVisual.widgets.splice(widgetIndexToRemove, 1);
                    logDebugConsole(
                        'debug',
                        `Removed widget (${widgetIdToRemove}) from the popover visual. {visuals}`,
                        popoverVisual
                    );
                } else {
                    logDebugConsole(
                        'warn',
                        `Unable to remove widget from behavior. Widget not found with id ${widgetIdToRemove}. {popoverVisual.widgets}`,
                        popoverVisual.widgets
                    );
                }
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
