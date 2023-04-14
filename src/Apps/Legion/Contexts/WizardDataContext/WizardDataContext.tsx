/**
 * This context is for managing the state and actions in the Wizard of the Legion app
 */
import produce from 'immer';
import React, { ReactNode, useContext, useReducer } from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IWizardDataStateContext,
    IWizardDataContextProviderProps,
    IWizardDataContextState,
    WizardDataContextAction,
    WizardDataContextActionType,
    IWizardDataDispatchContext
} from './WizardDataContext.types';
import { addItem, replaceItem } from '../../Services/Utils';
import {
    removeEntityById,
    removeRelationshipById,
    removeTypeById,
    removePropertyById
} from './WizardDataContext.utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger(
    'WizardDataContext',
    debugLogging
);

export const WizardDataDispatchContext = React.createContext<IWizardDataDispatchContext>(
    null
);
export const WizardDataStateContext = React.createContext<IWizardDataStateContext>(
    null
);
export const useWizardDataDispatchContext = () =>
    useContext(WizardDataDispatchContext);
export const useWizardDataStateContext = () =>
    useContext(WizardDataStateContext);

export const WizardDataContextReducer: (
    draft: IWizardDataContextState,
    action: WizardDataContextAction
) => IWizardDataContextState = produce(
    (draft: IWizardDataContextState, action: WizardDataContextAction) => {
        logDebugConsole(
            'info',
            `Updating WizardData context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case WizardDataContextActionType.ENTITY_ADD: {
                const { entity } = action.payload;
                addItem(entity, draft.entities);
                break;
            }
            case WizardDataContextActionType.ENTITY_UPDATE: {
                const { entity } = action.payload;
                replaceItem(entity, draft.entities);
                break;
            }
            case WizardDataContextActionType.ENTITY_REMOVE: {
                const { entityId } = action.payload;
                removeEntityById(entityId, draft);
                break;
            }
            case WizardDataContextActionType.TYPE_ADD: {
                const { type } = action.payload;
                addItem(type, draft.types);
                break;
            }
            case WizardDataContextActionType.TYPE_UPDATE: {
                const { type } = action.payload;
                replaceItem(type, draft.types);
                break;
            }
            case WizardDataContextActionType.TYPE_REMOVE: {
                const { typeId } = action.payload;
                removeTypeById(typeId, draft);
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_ADD: {
                const { relationship, relationshipType } = action.payload;
                addItem(relationship, draft.relationships);
                addItem(relationshipType, draft.relationshipTypes);
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_UPDATE: {
                const { relationship, relationshipType } = action.payload;
                replaceItem(relationship, draft.relationships);
                replaceItem(relationshipType, draft.relationshipTypes);
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_REMOVE: {
                const { relationshipId } = action.payload;
                removeRelationshipById(relationshipId, draft);
                break;
            }
            case WizardDataContextActionType.PROPERTY_ADD: {
                const { property } = action.payload;
                addItem(property, draft.properties);
                break;
            }
            case WizardDataContextActionType.PROPERTY_UPDATE: {
                const { property } = action.payload;
                replaceItem(property, draft.properties);
                break;
            }
            case WizardDataContextActionType.PROPERTY_REMOVE: {
                const { propertyId } = action.payload;
                removePropertyById(propertyId, draft);
                break;
            }
        }
    }
);

export const WizardDataContextProvider = React.memo(
    <T extends object>(
        props: IWizardDataContextProviderProps<T> & { children?: ReactNode }
    ) => {
        const { children, initialState } = props;

        const [state, dispatch] = useReducer(WizardDataContextReducer, {
            ...emptyState,
            ...initialState
        });

        logDebugConsole(
            'debug',
            'Mount WizardDataContextProvider. {state}',
            state
        );
        return (
            <WizardDataDispatchContext.Provider
                value={{
                    wizardDataDispatch: dispatch
                }}
            >
                <WizardDataStateContext.Provider
                    value={{
                        wizardDataState: state
                    }}
                >
                    {children}
                </WizardDataStateContext.Provider>
            </WizardDataDispatchContext.Provider>
        );
    }
);

const emptyState: IWizardDataContextState = {
    entities: [],
    properties: [],
    relationships: [],
    relationshipTypes: [],
    types: []
};
