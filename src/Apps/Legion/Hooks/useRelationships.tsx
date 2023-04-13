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
    const setRelationships = useCallback((relationships: IDbRelationship[]) => {
        wizardDataDispatch({
            type: WizardDataContextActionType.SET_RELATIONSHIPS,
            payload: {
                relationships: relationships
            }
        });
    }, []);
    const addRelationship = useCallback((relationship: IViewRelationship) => {
        const existingRels = wizardDataState.relationships;
        existingRels.push(convertRelationshipToDb(relationship));
        logDebugConsole(
            'info',
            'Adding relationship to state. {relationship, state}',
            relationship,
            existingRels
        );
        setRelationships(existingRels);
    }, []);
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
        []
    );
    const deleteRelationship = useCallback((relationshipId: string) => {
        const existingRels = wizardDataState.relationships;
        const filtered = filterItemsById(relationshipId, existingRels);
        logDebugConsole(
            'info',
            `Removing relationship (id: ${relationshipId}) from state. {id, state}`,
            relationshipId,
            existingRels
        );
        setRelationships(filtered);
    }, []);

    // data
    const relationships: IViewRelationship[] = useMemo(
        () =>
            wizardDataState.relationships.map((x) =>
                convertRelationshipToView(x, wizardDataState)
            ),
        []
    );

    return {
        relationships: relationships,
        addRelationship: addRelationship,
        updateRelationship: updateRelationship,
        deleteRelationship: deleteRelationship
    };
};
