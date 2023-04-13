import { useCallback, useMemo } from 'react';
import { useWizardDataContext } from '../Contexts/WizardDataContext/WizardDataContext';
import { IDbEntity, IViewEntity } from '../Models';
import {
    convertEntityToDb,
    convertEntityToView
} from '../Services/AppTypeUtilities';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { filterItemsById, getIndexById, getItemById } from './appData.utils';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useEntities', debugLogging);
export const useEntities = () => {
    // contexts
    const { wizardDataDispatch, wizardDataState } = useWizardDataContext();

    // callbacks
    const setEntities = useCallback(
        (entities: IDbEntity[]) => {
            wizardDataDispatch({
                type: WizardDataContextActionType.SET_ENTITIES,
                payload: {
                    entities: entities
                }
            });
        },
        [wizardDataDispatch]
    );
    const addEntity = useCallback(
        (entity: IViewEntity) => {
            const existing = wizardDataState.entities;
            existing.push(convertEntityToDb(entity));
            logDebugConsole(
                'info',
                'Adding Entity to state. {Entity, state}',
                entity,
                existing
            );
            setEntities(existing);
        },
        [wizardDataState.entities, setEntities]
    );
    const updateEntity = useCallback(
        (updatedProperty: IViewEntity) => {
            const existing = wizardDataState.entities;
            const index = getIndexById(updatedProperty.id, existing);
            existing[index] = convertEntityToDb(updatedProperty);
            logDebugConsole(
                'info',
                `Updating Entity (id: ${updatedProperty.id}) in state. {Entity, state}`,
                updatedProperty,
                existing
            );
            setEntities(existing);
        },
        [wizardDataState.entities, setEntities]
    );
    const deleteEntity = useCallback(
        (PropertyId: string) => {
            const existing = wizardDataState.entities;
            const filtered = filterItemsById(PropertyId, existing);
            logDebugConsole(
                'info',
                `Removing Entity (id: ${PropertyId}) from state. {id, state}`,
                PropertyId,
                existing
            );
            setEntities(filtered);
        },
        [wizardDataState.entities, setEntities]
    );

    // data
    const entities: IViewEntity[] = useMemo(
        () =>
            wizardDataState.entities.map((x) =>
                convertEntityToView(x, wizardDataState)
            ),
        [wizardDataState.entities]
    );

    return {
        entities: entities,
        addEntity: addEntity,
        updateEntity: updateEntity,
        deleteEntity: deleteEntity
    };
};
