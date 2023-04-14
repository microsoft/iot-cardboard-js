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
import { findIndexById, findItemById } from '../../Services/Utils';
import {
    removeEntityById,
    removeRelationshipsByEntityId,
    removeRelationshipById
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
                if (action.payload.entity) {
                    draft.entities.push(action.payload.entity);
                }
                break;
            }
            case WizardDataContextActionType.ENTITY_UPDATE: {
                const index = findIndexById(
                    action.payload.entity.id,
                    draft.entities
                );
                if (index > -1 && action.payload.entity) {
                    draft.entities[index] = action.payload.entity;
                }
                break;
            }
            case WizardDataContextActionType.ENTITY_REMOVE: {
                const { entityId } = action.payload;
                removeRelationshipsByEntityId(entityId, draft);
                removeEntityById(entityId, draft);
                break;
            }
            case WizardDataContextActionType.TYPE_ADD: {
                if (action.payload.type) {
                    draft.types.push(action.payload.type);
                }
                break;
            }
            case WizardDataContextActionType.TYPE_UPDATE: {
                const index = findIndexById(
                    action.payload.type.id,
                    draft.types
                );
                if (index > -1 && action.payload.type) {
                    draft.types[index] = action.payload.type;
                }
                break;
            }
            case WizardDataContextActionType.TYPE_REMOVE: {
                const index = findIndexById(action.payload.typeId, draft.types);
                if (index > -1) {
                    draft.types.splice(index, 1);
                }
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_ADD: {
                if (action.payload.relationship) {
                    draft.relationships.push(action.payload.relationship);
                }
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_UPDATE: {
                const index = findIndexById(
                    action.payload.relationship.id,
                    draft.relationships
                );
                if (index > -1 && action.payload.relationship) {
                    draft.relationships[index] = action.payload.relationship;
                }
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_REMOVE: {
                removeRelationshipById(action.payload.relationshipId, draft);
                break;
            }
            case WizardDataContextActionType.PROPERTY_ADD: {
                if (action.payload.property) {
                    draft.properties.push(action.payload.property);
                }
                break;
            }
            case WizardDataContextActionType.PROPERTY_UPDATE: {
                const index = findIndexById(
                    action.payload.property.id,
                    draft.properties
                );
                if (index > -1 && action.payload.property) {
                    draft.properties[index] = action.payload.property;
                }
                break;
            }
            case WizardDataContextActionType.PROPERTY_REMOVE: {
                const index = findIndexById(
                    action.payload.propertyId,
                    draft.properties
                );
                if (index > -1) {
                    draft.properties.splice(index, 1);
                }
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
    types: []
};
