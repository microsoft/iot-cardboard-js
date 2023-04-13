import { useCallback, useMemo } from 'react';
import { useWizardDataContext } from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IDbType, IViewType } from '../Models';
import {
    convertTypeToDb,
    convertTypeToView
} from '../Services/AppTypeUtilities';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { filterItemsById, getIndexById, getItemById } from './appData.utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useTypes', debugLogging);
export const useTypes = () => {
    // contexts
    const { wizardDataDispatch, wizardDataState } = useWizardDataContext();

    // callbacks
    const setTypes = useCallback(
        (types: IDbType[]) => {
            wizardDataDispatch({
                type: WizardDataContextActionType.SET_TYPES,
                payload: {
                    types: types
                }
            });
        },
        [wizardDataDispatch]
    );
    const addProperty = useCallback(
        (type: IViewType) => {
            const existing = wizardDataState.types;
            existing.push(convertTypeToDb(type));
            logDebugConsole(
                'info',
                'Adding Type to state. {Type, state}',
                type,
                existing
            );
            setTypes(existing);
        },
        [wizardDataState.types, setTypes]
    );
    const updateProperty = useCallback(
        (updatedProperty: IViewType) => {
            const existing = wizardDataState.types;
            const index = getIndexById(updatedProperty.id, existing);
            existing[index] = convertTypeToDb(updatedProperty);
            logDebugConsole(
                'info',
                `Updating Type (id: ${updatedProperty.id}) in state. {Type, state}`,
                updatedProperty,
                existing
            );
            setTypes(existing);
        },
        [wizardDataState.types, setTypes]
    );
    const deleteProperty = useCallback(
        (PropertyId: string) => {
            const existing = wizardDataState.types;
            const filtered = filterItemsById(PropertyId, existing);
            logDebugConsole(
                'info',
                `Removing Type (id: ${PropertyId}) from state. {id, state}`,
                PropertyId,
                existing
            );
            setTypes(filtered);
        },
        [wizardDataState.types, setTypes]
    );

    // data
    const types: IViewType[] = useMemo(
        () =>
            wizardDataState.types.map((x) =>
                convertTypeToView(x, wizardDataState)
            ),
        [wizardDataState.types]
    );

    return {
        types: types,
        addProperty: addProperty,
        updateProperty: updateProperty,
        deleteProperty: deleteProperty
    };
};
