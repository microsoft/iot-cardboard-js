import { useCallback, useMemo } from 'react';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IViewType } from '../Models';
import {
    convertViewTypeToDb,
    convertDbTypeToView
} from '../Services/WizardTypes.utils';
import { getDebugLogger } from '../../../Models/Services/Utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useTypes', debugLogging);
export const useTypes = () => {
    // contexts
    const { wizardDataDispatch } = useWizardDataDispatchContext();
    const { wizardDataState } = useWizardDataStateContext();

    // callbacks
    const addType = useCallback(
        (type: IViewType) => {
            const newType = convertViewTypeToDb(type);
            logDebugConsole('info', 'Adding Type to state. {Type}', type);
            wizardDataDispatch({
                type: WizardDataContextActionType.TYPE_ADD,
                payload: {
                    type: newType
                }
            });
        },
        [wizardDataDispatch]
    );
    const updateType = useCallback(
        (updatedType: IViewType) => {
            const type = convertViewTypeToDb(updatedType);
            logDebugConsole(
                'info',
                `Updating Type (id: ${updatedType.id}) in state. {Type}`,
                type
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.TYPE_UPDATE,
                payload: {
                    type: type
                }
            });
        },
        [wizardDataDispatch]
    );
    const deleteType = useCallback(
        (typeId: string) => {
            logDebugConsole(
                'info',
                `Removing Type (id: ${typeId}) from state. {id}`,
                typeId
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.TYPE_REMOVE,
                payload: {
                    typeId: typeId
                }
            });
        },
        [wizardDataDispatch]
    );

    // data
    const types: IViewType[] = useMemo(
        () =>
            wizardDataState.types.map((x) =>
                convertDbTypeToView(x, wizardDataState)
            ),
        [wizardDataState]
    );

    return {
        /** the current list of types in the state */
        types: types,
        /**
         * Callback to add an type to the state
         * NOTE: this is not a deep add. It will only add the root level element
         */
        addProperty: addType,
        /**
         * Callback to update the attributes of the type.
         * NOTE: this is not a deep update. It will only reflect changes on the root level
         */
        updateProperty: updateType,
        /**
         * Callback to delete the type from state.
         * NOTE: this is not a deep update. It will only delete the root level element
         */
        deleteProperty: deleteType
    };
};
