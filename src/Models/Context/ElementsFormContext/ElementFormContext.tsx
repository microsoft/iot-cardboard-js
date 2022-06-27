/**
 * This context is for managing the state of creating and editing a element object
 */
import produce, { current } from 'immer';
import React, { useContext, useReducer } from 'react';
import { deepCopy, getDebugLogger } from '../../Services/Utils';
import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IElementFormContext,
    IElementFormContextState,
    ElementFormContextAction,
    ElementFormContextActionType,
    IElementFormContextProviderProps
} from './ElementFormContext.types';
import { isStateDirty } from './ElementFormContextUtility';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ElementFormContext', debugLogging);

export const ElementFormContext = React.createContext<IElementFormContext>(
    null
);
export const useElementFormContext = () => useContext(ElementFormContext);

export const ElementFormContextReducer: (
    draft: IElementFormContextState,
    action: ElementFormContextAction
) => IElementFormContextState = produce(
    (draft: IElementFormContextState, action: ElementFormContextAction) => {
        logDebugConsole(
            'info',
            `Updating ElementForm context ${action.type} with: {payload, element}`,
            (action as any).payload, // ignore that payload doesn't always come since this is just a log
            current(draft.elementToEdit)
        );
        switch (action.type) {
            case ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS: {
                const set = new Set<string>(action.payload.meshIds);
                draft.elementToEdit.objectIDs = Array.from(set);
                break;
            }
            case ElementFormContextActionType.FORM_ELEMENT_DISPLAY_NAME_SET: {
                draft.elementToEdit.displayName = action.payload.name;
                break;
            }
            case ElementFormContextActionType.FORM_ELEMENT_TWIN_ID_SET: {
                const newTwinId = action.payload.twinId;

                // use the twin id as the name if a name isn't set yet
                // OR if they were previously the same, update it
                if (
                    !draft.elementToEdit.displayName ||
                    draft.elementToEdit.displayName ===
                        draft.elementToEdit.primaryTwinID
                ) {
                    draft.elementToEdit.displayName = newTwinId;
                }

                draft.elementToEdit.primaryTwinID = newTwinId;
                break;
            }
            case ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE: {
                if (!draft.elementToEdit.twinAliases) {
                    logDebugConsole(
                        'warn',
                        'Removing twin alias. Unable to alias from element. Alias object not found.'
                    );
                    return;
                }

                delete draft.elementToEdit.twinAliases[
                    action.payload.aliasName
                ];
                // clean up the object if we've removed all the entries
                if (Object.keys(draft.elementToEdit.twinAliases).length === 0) {
                    delete draft.elementToEdit.twinAliases;
                }
                break;
            }
            case ElementFormContextActionType.FORM_ELEMENT_RESET: {
                // if given a element to use, use it. Otherwise fall back to the initial value given to the provider
                if (action.payload?.element) {
                    draft.elementToEdit = deepCopy(action.payload?.element);
                } else {
                    draft.elementToEdit = deepCopy(initialElement);
                }
                break;
            }
        }

        // check for changes after every action
        draft.isDirty = isStateDirty(draft, initialElement, logDebugConsole);
    }
);

let initialElement: ITwinToObjectMapping;
export const ElementFormContextProvider: React.FC<IElementFormContextProviderProps> = (
    props
) => {
    const { children } = props;

    // skip wrapping if the context already exists
    const existingContext = useElementFormContext();
    if (existingContext) {
        return <>{children}</>;
    }

    const { elementToEdit } = props;
    initialElement = deepCopy(elementToEdit);

    // TODO: remove this copy when we turn off auto freeze
    const defaultState: IElementFormContextState = {
        elementToEdit: deepCopy(elementToEdit),
        isDirty: false
    };

    const [elementFormState, elementFormDispatch] = useReducer(
        ElementFormContextReducer,
        defaultState
    );
    return (
        <ElementFormContext.Provider
            value={{
                elementFormDispatch,
                elementFormState
            }}
        >
            {children}
        </ElementFormContext.Provider>
    );
};