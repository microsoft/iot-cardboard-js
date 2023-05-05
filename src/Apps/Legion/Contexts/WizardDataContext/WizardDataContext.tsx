/**
 * This context is for managing the state and actions in the Wizard of the Legion app
 */
import produce, { current } from 'immer';
import React, { ReactNode, useContext, useReducer } from 'react';
import { deepCopy, getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IWizardDataStateContext,
    IWizardDataContextProviderProps,
    IWizardDataContextState,
    WizardDataContextAction,
    WizardDataContextActionType,
    IWizardDataDispatchContext
} from './WizardDataContext.types';
import {
    addItem,
    getColorByIdx,
    replaceItem,
    replaceOrAddItem
} from '../../Services/Utils';
import {
    removeEntityById,
    deleteRelationshipById,
    deleteTypeById,
    deletePropertyById,
    initializeId
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
            `[START] Updating WizardData context ${action.type} with payload: `,
            (action as any).payload // sometimes doesn't have payload
        );
        switch (action.type) {
            case WizardDataContextActionType.ENTITY_ADD: {
                const { entity } = deepCopy(action.payload);
                addItem(initializeId(entity), draft.entities);
                break;
            }
            case WizardDataContextActionType.ENTITY_UPDATE: {
                const { entity } = deepCopy(action.payload);
                replaceItem(entity, draft.entities);
                break;
            }
            case WizardDataContextActionType.ENTITY_REMOVE: {
                const { entityId } = action.payload;
                removeEntityById(entityId, draft);
                break;
            }
            case WizardDataContextActionType.TYPE_ADD: {
                const { type } = deepCopy(action.payload);
                addItem(initializeId(type), draft.types);
                break;
            }
            case WizardDataContextActionType.TYPE_UPDATE: {
                const { type } = deepCopy(action.payload);
                replaceItem(type, draft.types);
                break;
            }
            case WizardDataContextActionType.TYPE_REMOVE: {
                const { typeId } = action.payload;
                deleteTypeById(typeId, draft);
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_ADD: {
                const { relationship, relationshipType } = deepCopy(
                    action.payload
                );
                addItem(
                    initializeId(relationshipType),
                    draft.relationshipTypes
                );
                addItem(initializeId(relationship), draft.relationships);
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_UPDATE: {
                const { relationship, relationshipType } = deepCopy(
                    action.payload
                );
                replaceItem(relationship, draft.relationships);
                replaceOrAddItem(
                    initializeId(relationshipType),
                    draft.relationshipTypes
                );
                break;
            }
            case WizardDataContextActionType.RELATIONSHIP_REMOVE: {
                const { relationshipId } = action.payload;
                deleteRelationshipById(relationshipId, draft);
                break;
            }
            case WizardDataContextActionType.PROPERTY_ADD: {
                const { property } = deepCopy(action.payload);
                addItem(initializeId(property), draft.properties);
                break;
            }
            case WizardDataContextActionType.PROPERTY_UPDATE: {
                const { property } = deepCopy(action.payload);
                replaceItem(property, draft.properties);
                break;
            }
            case WizardDataContextActionType.PROPERTY_REMOVE: {
                const { propertyId } = action.payload;
                deletePropertyById(propertyId, draft);
                break;
            }
            case WizardDataContextActionType.ADD_COOKED_SOURCE_ASSETS: {
                const { data } = action.payload;
                draft.properties = draft.properties.concat(data.properties);
                const types = deepCopy(data.types);
                draft.types = draft.types.concat(
                    types.map((t, idx) => {
                        t.color = getColorByIdx(draft.types.length + idx);
                        return t;
                    })
                );
                draft.entities = draft.entities.concat(data.entities);
                break;
            }
        }
        logDebugConsole(
            'info',
            `[END] Updating WizardData context ${action.type} with payload: `,
            current(draft)
        );
    }
);

export const WizardDataContextProvider = React.memo(
    (props: IWizardDataContextProviderProps & { children?: ReactNode }) => {
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
