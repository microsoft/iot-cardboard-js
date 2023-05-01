import { useCallback, useMemo } from 'react';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { ITypeCounters, IViewType, Kind } from '../Models';
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

    // Single item
    const getTypeById = useCallback(
        (typeId: string): IViewType => {
            return types?.find((t) => t.id === typeId);
        },
        [types]
    );

    const getTypeCountsByKind = useCallback((): ITypeCounters => {
        const counters: ITypeCounters = {
            userDefined: 0,
            pid: 0,
            timeSeries: 0,
            asset: 0
        };
        wizardDataState.types.forEach((x) => {
            {
                if (x.kind === Kind.UserDefined) {
                    counters.userDefined += 1;
                } else if (x.kind === Kind.PID) {
                    counters.pid += 1;
                } else if (x.kind === Kind.TimeSeries) {
                    counters.timeSeries += 1;
                } else {
                    counters.asset += 1;
                }
            }
        });
        return counters;
    }, [wizardDataState.types]);

    const getTotalTypeCount = useCallback((): number => {
        return wizardDataState.types.length;
    }, [wizardDataState.types]);

    return {
        /** the current list of types in the state */
        types: types,
        /**
         * Callback to add an type to the state
         * NOTE: this is not a deep add. It will only add the root level element
         */
        addType: addType,
        /**
         * Callback to update the attributes of the type.
         * NOTE: this is not a deep update. It will only reflect changes on the root level
         */
        updateType: updateType,
        /**
         * Callback to delete the type from state.
         * NOTE: this is not a deep update. It will only delete the root level element
         */
        deleteType: deleteType,
        /**
         * Callback to get a type from an id
         */
        getTypeById: getTypeById,
        /** Callback to get type count by kind */
        getTypeCountsByKind: getTypeCountsByKind,
        /** Callback to get total type count */
        getTotalTypeCount: getTotalTypeCount
    };
};
