import { useCallback, useMemo } from 'react';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IViewRelationship } from '../Models';
import {
    convertRelationshipToDb,
    convertRelationshipToView
} from '../Services/AppTypeUtilities';
import { getDebugLogger } from '../../../Models/Services/Utils';

const debugLogging = false;
export const logDebugConsole = getDebugLogger('useRelationships', debugLogging);
export const useRelationships = () => {
    // contexts
    const { wizardDataDispatch } = useWizardDataDispatchContext();
    const { wizardDataState } = useWizardDataStateContext();

    // callbacks
    const addRelationship = useCallback(
        (relationship: IViewRelationship) => {
            const newRelationship = convertRelationshipToDb(relationship);
            logDebugConsole(
                'info',
                'Adding relationship to state. {relationship, state}',
                newRelationship
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.RELATIONSHIP_ADD,
                payload: {
                    relationship: newRelationship
                }
            });
        },
        [wizardDataDispatch]
    );
    const updateRelationship = useCallback(
        (updatedRelationship: IViewRelationship) => {
            const relationship = convertRelationshipToDb(updatedRelationship);
            logDebugConsole(
                'info',
                `Updating relationship (id: ${updatedRelationship.id}) in state. {relationship}`,
                relationship
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.RELATIONSHIP_UPDATE,
                payload: {
                    relationship: relationship
                }
            });
        },
        [wizardDataDispatch]
    );
    const deleteRelationship = useCallback(
        (relationshipId: string) => {
            logDebugConsole(
                'info',
                `Removing relationship (id: ${relationshipId}) from state. {id}`,
                relationshipId
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.RELATIONSHIP_REMOVE,
                payload: {
                    relationshipId: relationshipId
                }
            });
        },
        [wizardDataDispatch]
    );

    // data
    const relationships: IViewRelationship[] = useMemo(
        () =>
            wizardDataState.relationships.map((x) =>
                convertRelationshipToView(x, wizardDataState)
            ),
        [wizardDataState]
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
