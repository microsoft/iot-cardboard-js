import { useCallback, useMemo } from 'react';
import {
    useWizardDataDispatchContext,
    useWizardDataStateContext
} from '../Contexts/WizardDataContext/WizardDataContext';
import { WizardDataContextActionType } from '../Contexts/WizardDataContext/WizardDataContext.types';
import { IViewRelationship, IViewRelationshipType } from '../Models';
import {
    convertViewRelationshipToDb,
    convertDbRelationshipToView,
    convertDbRelationshipTypeToView,
    convertViewRelationshipTypeToDb
} from '../Services/WizardTypes.utils';
import { getDebugLogger } from '../../../Models/Services/Utils';

const debugLogging = true;
export const logDebugConsole = getDebugLogger('useRelationships', debugLogging);
export const useRelationships = () => {
    logDebugConsole('debug', '[START] Render');
    // contexts
    const { wizardDataDispatch } = useWizardDataDispatchContext();
    const { wizardDataState } = useWizardDataStateContext();

    // callbacks
    const addRelationship = useCallback(
        (relationship: IViewRelationship) => {
            const newRelationship = convertViewRelationshipToDb(relationship);
            const newRelationshipType = convertViewRelationshipTypeToDb(
                relationship.type
            );
            logDebugConsole(
                'info',
                'Adding relationship to state. {relationship, state}',
                newRelationship
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.RELATIONSHIP_ADD,
                payload: {
                    relationship: newRelationship,
                    relationshipType: newRelationshipType
                }
            });
        },
        [wizardDataDispatch]
    );
    const updateRelationship = useCallback(
        (updatedRelationship: IViewRelationship) => {
            const relationship = convertViewRelationshipToDb(
                updatedRelationship
            );
            const relationshipType = convertViewRelationshipTypeToDb(
                updatedRelationship.type
            );

            logDebugConsole(
                'info',
                `Updating relationship (id: ${updatedRelationship.id}) in state. {relationship}`,
                relationship
            );
            wizardDataDispatch({
                type: WizardDataContextActionType.RELATIONSHIP_UPDATE,
                payload: {
                    relationship: relationship,
                    relationshipType: relationshipType
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
            wizardDataState.relationships.map((x) => {
                logDebugConsole('debug', 'Converting relationship', x);
                return convertDbRelationshipToView(x, wizardDataState);
            }),
        [wizardDataState]
    );
    const relationshipTypes: IViewRelationshipType[] = useMemo(
        () =>
            wizardDataState.relationshipTypes.map((x) => {
                logDebugConsole('debug', 'Converting relationship type', x);
                return convertDbRelationshipTypeToView(x);
            }),
        [wizardDataState]
    );

    const data = {
        /** the current list of relationships in the state */
        relationships: relationships,
        /** the list of unique relationship types */
        relationshipTypes: relationshipTypes,
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
    logDebugConsole('debug', '[END] Render', data);
    return data;
};
