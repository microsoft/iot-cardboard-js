/**
 * This context is for managing the state and actions on the Ontology Authoring Tool page
 */
import produce from 'immer';
import React, { useContext, useReducer } from 'react';
import { getDebugLogger, isDefined } from '../../Services/Utils';
import {
    IOatGraphContext,
    IOatGraphContextProviderProps,
    IOatGraphContextState,
    OatGraphContextAction,
    OatGraphContextActionType
} from './OatGraphContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('OatGraphContext', debugLogging);

export const OatGraphContext = React.createContext<IOatGraphContext>(null);
export const useOatGraphContext = () => useContext(OatGraphContext);

const defaultState: IOatGraphContextState = {
    isLoading: false,
    isLegendVisible: false,
    isMiniMapVisible: true,
    isModelListVisible: true,
    showComponents: true,
    showInheritances: true,
    showRelationships: true,
    isEdgeDragging: false
};

export const OatGraphContextReducer: (
    draft: IOatGraphContextState,
    action: OatGraphContextAction
) => IOatGraphContextState = produce(
    (draft: IOatGraphContextState, action: OatGraphContextAction) => {
        logDebugConsole(
            'info',
            `Updating OAT Graph context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case OatGraphContextActionType.LOADING_TOGGLE: {
                draft.isLoading = isDefined(action.payload?.value)
                    ? action.payload?.value
                    : !draft.isLoading;
                break;
            }
            case OatGraphContextActionType.LEGEND_VISBLE_TOGGLE: {
                draft.isLegendVisible = isDefined(action.payload?.value)
                    ? action.payload?.value
                    : !draft.isLegendVisible;
                break;
            }
            case OatGraphContextActionType.MINI_MAP_VISIBLE_TOGGLE: {
                draft.isMiniMapVisible = isDefined(action.payload?.value)
                    ? action.payload?.value
                    : !draft.isMiniMapVisible;
                break;
            }
            case OatGraphContextActionType.MODEL_LIST_VISIBLE_TOGGLE: {
                draft.isModelListVisible = isDefined(action.payload?.value)
                    ? action.payload?.value
                    : !draft.isModelListVisible;
                break;
            }
            case OatGraphContextActionType.SHOW_COMPONENTS_TOGGLE: {
                draft.showComponents = isDefined(action.payload?.enabled)
                    ? action.payload?.enabled
                    : !draft.showComponents;
                break;
            }
            case OatGraphContextActionType.SHOW_INHERITANCES_TOGGLE: {
                draft.showInheritances = isDefined(action.payload?.enabled)
                    ? action.payload?.enabled
                    : !draft.showInheritances;
                break;
            }
            case OatGraphContextActionType.SHOW_RELATIONSHIPS_TOGGLE: {
                draft.showRelationships = isDefined(action.payload?.enabled)
                    ? action.payload?.enabled
                    : !draft.showRelationships;
                break;
            }
            case OatGraphContextActionType.SET_IS_EDGE_DRAGGING: {
                draft.isEdgeDragging = action.payload.isDragging;
                break;
            }
        }
    }
);

export const OatGraphContextProvider: React.FC<IOatGraphContextProviderProps> = React.memo(
    (props) => {
        const { children, initialState } = props;

        // skip wrapping if the context already exists
        const existingContext = useOatGraphContext();
        if (existingContext) {
            return <>{children}</>;
        }

        const [oatGraphState, oatGraphDispatch] = useReducer(
            OatGraphContextReducer,
            {
                ...defaultState,
                ...initialState
            }
        );

        logDebugConsole(
            'debug',
            'Mount OatGraphContextProvider. {state}',
            oatGraphState
        );
        return (
            <OatGraphContext.Provider
                value={{
                    oatGraphDispatch,
                    oatGraphState
                }}
            >
                {children}
            </OatGraphContext.Provider>
        );
    }
);
