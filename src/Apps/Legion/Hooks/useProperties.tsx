import { useCallback, useMemo } from 'react';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IViewProperty } from '../Models';
import {
    convertViewPropertyToDb,
    convertDbPropertyToView
} from '../Services/WizardTypes.utils';
import { getDebugLogger } from '../../../Models/Services/Utils';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useProperties', debugLogging);

/** hook for getting and operating on the Property data in the wizard context */
export const useProperties = () => {
    // contexts
    const { wizardDataDispatch } = useWizardDataDispatchContext();
    const { wizardDataState } = useWizardDataStateContext();

    // callbacks
    const addProperty = useCallback(
        (property: IViewProperty) => {
            const newProperty = convertViewPropertyToDb(property);
            logDebugConsole(
                'info',
                'Adding Property to state. {Property}',
                newProperty
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.PROPERTY_ADD,
                payload: {
                    property: newProperty
                }
            });
        },
        [wizardDataDispatch]
    );
    const updateProperty = useCallback(
        (updatedProperty: IViewProperty) => {
            const property = convertViewPropertyToDb(updatedProperty);
            logDebugConsole(
                'info',
                `Updating Property (id: ${updatedProperty.id}) in state. {Property}`,
                property
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.PROPERTY_UPDATE,
                payload: {
                    property: property
                }
            });
        },
        [wizardDataDispatch]
    );
    const deleteProperty = useCallback(
        (propertyId: string) => {
            logDebugConsole(
                'info',
                `Removing Property (id: ${propertyId}) from state. {id}`,
                propertyId
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.PROPERTY_REMOVE,
                payload: {
                    propertyId: propertyId
                }
            });
        },
        [wizardDataDispatch]
    );

    // data
    const properties: IViewProperty[] = useMemo(
        () => wizardDataState.properties.map((x) => convertDbPropertyToView(x)),
        [wizardDataState.properties]
    );

    return {
        /** the current list of properties in the state */
        properties: properties,
        /**
         * Callback to add an entity to the state
         * NOTE: this is not a deep add. It will only add the root level element
         */
        addProperty: addProperty,
        /**
         * Callback to update the attributes of the entity.
         * NOTE: this is not a deep update. It will only reflect changes on the root level
         */
        updateProperty: updateProperty,
        /**
         * Callback to delete the entity from state.
         * NOTE: this is not a deep update. It will only delete the root level element
         */
        deleteProperty: deleteProperty
    };
};
