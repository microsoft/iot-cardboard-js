import { useCallback, useMemo } from 'react';
import { useWizardDataContext } from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IDbRelationship, IViewRelationship } from '../Models';
import {
    convertRelationshipToDb,
    convertRelationshipToView
} from '../Services/AppTypeUtilities';
import { getDebugLogger } from '../../../Models/Services/Utils';
import { filterItemsById, getIndexById, getItemById } from './appData.utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useRelationships', debugLogging);
export const useRelationships = () => {
    // contexts
    const { wizardDataDispatch, wizardDataState } = useWizardDataContext();

    // callbacks
    const setRelationships = useCallback(
        (relationships: IDbRelationship[]) => {
            wizardDataDispatch({
                type: WizardDataContextActionType.SET_RELATIONSHIPS,
                payload: {
                    relationships: relationships
                }
            });
        },
        [wizardDataDispatch]
    );
    const addRelationship = useCallback(
        (relationship: IViewRelationship) => {
            const existingRels = wizardDataState.relationships;
            existingRels.push(convertRelationshipToDb(relationship));
            logDebugConsole(
                'info',
                'Adding relationship to state. {relationship, state}',
                relationship,
                existingRels
            );
            setRelationships(existingRels);
        },
        [wizardDataState.relationships, setRelationships]
    );
    const updateRelationship = useCallback(
        (updatedRelationship: IViewRelationship) => {
            const existingRels = wizardDataState.relationships;
            const index = getIndexById(updatedRelationship.id, existingRels);
            existingRels[index] = convertRelationshipToDb(updatedRelationship);
            logDebugConsole(
                'info',
                `Updating relationship (id: ${updatedRelationship.id}) in state. {relationship, state}`,
                updatedRelationship,
                existingRels
            );
            setRelationships(existingRels);
        },
        [wizardDataState.relationships, setRelationships]
    );
    const deleteRelationship = useCallback(
        (relationshipId: string) => {
            const existingRels = wizardDataState.relationships;
            const filtered = filterItemsById(relationshipId, existingRels);
            logDebugConsole(
                'info',
                `Removing relationship (id: ${relationshipId}) from state. {id, state}`,
                relationshipId,
                existingRels
            );
            setRelationships(filtered);
        },
        [wizardDataState.relationships, setRelationships]
    );

    // data
    const relationships: IViewRelationship[] = useMemo(
        () =>
            wizardDataState.relationships.map((x) =>
                convertRelationshipToView(x, wizardDataState)
            ),
        [wizardDataState.relationships]
    );

    return {
        /** the current list of relationships in the state */
        relationships: relationships,
        /**
         * Callback to add a relationship to the state
         * NOTE: this is not a deep add. It will only add the root level element
         */
        addRelationship: addRelationship,
        /**
         * Callback to update the attributes of the relationship.
         * NOTE: this is not a deep update. It will only reflect changes on the root level
         */
        updateRelationship: updateRelationship,
        /**
         * Callback to delete the relationship from state.
         * NOTE: this is not a deep update. It will only delete the root level element
         */
        deleteRelationship: deleteRelationship
    };
};
