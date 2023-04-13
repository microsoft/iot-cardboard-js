import { useCallback, useMemo } from 'react';
import { useWizardDataContext } from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IDbProperty, IViewProperty } from '../Models';
import {
    convertPropertyToDb,
    convertPropertyToView
} from '../Services/AppTypeUtilities';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { filterItemsById, getIndexById, getItemById } from './appData.utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useProperties', debugLogging);
export const useProperties = () => {
    // contexts
    const { wizardDataDispatch, wizardDataState } = useWizardDataContext();

    // callbacks
    const setProperties = useCallback((properties: IDbProperty[]) => {
        wizardDataDispatch({
            type: WizardDataContextActionType.SET_PROPERTIES,
            payload: {
                properties: properties
            }
        });
    }, []);
    const addProperty = useCallback((Property: IViewProperty) => {
        const existing = wizardDataState.properties;
        existing.push(convertPropertyToDb(Property));
        logDebugConsole(
            'info',
            'Adding Property to state. {Property, state}',
            Property,
            existing
        );
        setProperties(existing);
    }, []);
    const updateProperty = useCallback((updatedProperty: IViewProperty) => {
        const existing = wizardDataState.properties;
        const index = getIndexById(updatedProperty.id, existing);
        existing[index] = convertPropertyToDb(updatedProperty);
        logDebugConsole(
            'info',
            `Updating Property (id: ${updatedProperty.id}) in state. {Property, state}`,
            updatedProperty,
            existing
        );
        setProperties(existing);
    }, []);
    const deleteProperty = useCallback((PropertyId: string) => {
        const existing = wizardDataState.properties;
        const filtered = filterItemsById(PropertyId, existing);
        logDebugConsole(
            'info',
            `Removing Property (id: ${PropertyId}) from state. {id, state}`,
            PropertyId,
            existing
        );
        setProperties(filtered);
    }, []);

    // data
    const properties: IViewProperty[] = useMemo(
        () => wizardDataState.properties.map((x) => convertPropertyToView(x)),
        []
    );

    return {
        properties: properties,
        addProperty: addProperty,
        updateProperty: updateProperty,
        deleteProperty: deleteProperty
    };
};
