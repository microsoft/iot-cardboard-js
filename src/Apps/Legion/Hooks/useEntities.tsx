import { useCallback, useMemo } from 'react';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';
import { IEntityCounters, IViewEntity } from '../Models';
import {
    convertViewEntityToDb,
    convertDbEntityToView
} from '../Services/WizardTypes.utils';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useEntities', debugLogging);

/** hook for getting and operating on the Entity data in the wizard context */
export const useEntities = () => {
    logDebugConsole('debug', '[START] Render');
    // contexts
    const { wizardDataDispatch } = useWizardDataDispatchContext();
    const { wizardDataState } = useWizardDataStateContext();

    // callbacks
    const addEntity = useCallback(
        (entity: IViewEntity) => {
            const newEntity = convertViewEntityToDb(entity);
            logDebugConsole('info', 'Adding Entity to state. {Entity}', entity);

            wizardDataDispatch({
                type: WizardDataContextActionType.ENTITY_ADD,
                payload: {
                    entity: newEntity
                }
            });
        },
        [wizardDataDispatch]
    );
    const updateEntity = useCallback(
        (updatedEntity: IViewEntity) => {
            const entity = convertViewEntityToDb(updatedEntity);
            logDebugConsole(
                'info',
                `Updating Entity (id: ${updatedEntity.id}) in state. {Entity}`,
                entity
            );

            wizardDataDispatch({
                type: WizardDataContextActionType.ENTITY_ADD,
                payload: {
                    entity: entity
                }
            });
        },
        [wizardDataDispatch]
    );
    const deleteEntity = useCallback(
        (entityId: string) => {
            logDebugConsole(
                'info',
                `Removing Entity (id: ${entityId}) from state. {id}`,
                entityId
            );

            wizardDataDispatch({
                type: WizardDataContextActionType.ENTITY_REMOVE,
                payload: {
                    entityId: entityId
                }
            });
        },
        [wizardDataDispatch]
    );

    // data
    const entities: IViewEntity[] = useMemo(
        () =>
            wizardDataState.entities.map((x) => {
                return convertDbEntityToView(x, wizardDataState);
            }),
        [wizardDataState]
    );

    const getEntityCount = useCallback(
        (typeId?: string): IEntityCounters => {
            const counters: IEntityCounters = {
                new: 0,
                existing: 0,
                deleted: 0
            };
            wizardDataState.entities.forEach((x) => {
                // If no typeId was specified, give us total counts
                if (!typeId || (typeId !== undefined && x.typeId === typeId)) {
                    if (x.isDeleted) {
                        counters.deleted += 1;
                    } else if (x.isNew) {
                        counters.new += 1;
                    } else {
                        counters.existing += 1;
                    }
                }
            });
            return counters;
        },
        [wizardDataState.entities]
    );

    const getTotalEntityCount = useCallback((): number => {
        return entities.length;
    }, [entities]);

    const data = useMemo(() => {
        return {
            /** the current list of entities in the state */
            entities: entities,
            /**
             * Callback to add an entity to the state
             * NOTE: this is not a deep add. It will only add the root level element
             */
            addEntity: addEntity,
            /**
             * Callback to update the attributes of the entity.
             * NOTE: this is not a deep update. It will only reflect changes on the root level
             */
            updateEntity: updateEntity,
            /**
             * Callback to delete the entity from state.
             * NOTE: this is not a deep update. It will only delete the root level element
             */
            deleteEntity: deleteEntity,
            /** Callback to get entity count per state based on Type */
            getEntityCount: getEntityCount,
            /** Callback to get total entity count */
            getTotalEntityCount: getTotalEntityCount
        };
    }, [
        addEntity,
        deleteEntity,
        entities,
        getEntityCount,
        getTotalEntityCount,
        updateEntity
    ]);
    logDebugConsole('debug', '[END] Render', data);
    return data;
};
