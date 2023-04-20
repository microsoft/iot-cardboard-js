import React, { useCallback, useState } from 'react';
import { ChoiceGroup, classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IFormChangeArgs,
    IFormData,
    IFormMode,
    IUserDefinedEntityFormProps,
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles
} from './UserDefinedEntityForm.types';
import { getFormStyles } from './UserDefinedEntityForm.styles';
import { useTranslation } from 'react-i18next';
import { useGraphContext } from '../../Contexts/GraphContext/GraphContext';
import CardboardModal from '../../../../Components/CardboardModal/CardboardModal';
import { GraphContextActionType } from '../../Contexts/GraphContext/GraphContext.types';
import UserDefinedEntityFormView from './UserDefinedEntityForm.view';
import { useRelationships } from '../../Hooks/useRelationships';
import { useTypes } from '../../Hooks/useTypes';
import { useEntities } from '../../Hooks/useEntities';
import { getNewViewRelationship } from '../../Services/WizardTypes.utils';

const debugLogging = true;
const logDebugConsole = getDebugLogger('UserDefinedEntityForm', debugLogging);

const getClassNames = classNamesFunction<
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles
>();

const LOC_KEYS = {
    formTitle: 'legionApp.UserDefinedEntityForm.formTitle',
    actionButtonText: 'legionApp.UserDefinedEntityForm.actionButtonText',
    existingOptionText: 'legionApp.UserDefinedEntityForm.optionExisting',
    newOptionText: 'legionApp.UserDefinedEntityForm.optionNew'
};

const UserDefinedEntityForm: React.FC<IUserDefinedEntityFormProps> = (
    props
) => {
    const { styles } = props;

    // contexts
    const { graphState, graphDispatch } = useGraphContext();

    // hooks
    const { t } = useTranslation();
    const { relationshipTypes, addRelationship } = useRelationships();
    const { types, addType } = useTypes();
    const { entities, addEntity } = useEntities();

    // state
    const [formData, setFormData] = useState<IFormData>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [formMode, setFormMode] = useState<IFormMode>('New');

    // callbacks
    const onFormChange = useCallback((formData: IFormChangeArgs) => {
        setFormData(formData.data);
        setIsFormValid(formData.isValid);
        logDebugConsole('debug', 'Form data change. {data}', formData);
    }, []);
    const onFormSubmit = useCallback(() => {
        logDebugConsole('debug', 'Submit click. {data}', formData);
        const relationshipType = formData.relationshipType;
        const sourceEntity = formData.parentEntity;

        // find the right source node
        if (formData.type === 'Existing') {
            logDebugConsole(
                'info',
                'Adding relationship to existing entity. {data}',
                formData
            );
        } else if (formData.type === 'New') {
            logDebugConsole(
                'info',
                'Adding relationship to new entity. {entity, type}',
                sourceEntity,
                sourceEntity.type
            );
            addEntity(sourceEntity);
            addType(sourceEntity.type);
        }
        if (!sourceEntity) {
            console.error(
                'Unable to find selected source entity. {formData}',
                formData
            );
            return;
        }

        // create the relationships
        graphState.selectedNodeIds.forEach((targetEntityId) => {
            // for each node create relationship
            const targetEntity = entities.find((x) => x.id === targetEntityId);
            if (targetEntity) {
                // create the relationship
                addRelationship(
                    getNewViewRelationship({
                        sourceEntity: sourceEntity,
                        targetEntity: targetEntity,
                        type: relationshipType
                    })
                );
                logDebugConsole(
                    'info',
                    `Added relationship (type: ${relationshipType.name}) between ${sourceEntity.friendlyName} and ${targetEntity.friendlyName}.`
                );
            } else {
                logDebugConsole(
                    'error',
                    `Could not find entity with id ${targetEntityId} to create relationship with`
                );
            }
        });
    }, [
        addEntity,
        addRelationship,
        addType,
        entities,
        formData,
        graphState.selectedNodeIds
    ]);

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <CardboardModal
            isOpen={graphState.isParentFormVisible}
            footerPrimaryButtonProps={{
                disabled: !isFormValid,
                text: t(LOC_KEYS.actionButtonText),
                onClick: onFormSubmit
            }}
            onDismiss={() => {
                logDebugConsole('info', 'Submitting form: {data}', formData);
                graphDispatch({
                    type: GraphContextActionType.PARENT_FORM_MODAL_HIDE
                });
            }}
            title={t(LOC_KEYS.formTitle)}
        >
            <ChoiceGroup
                options={[
                    {
                        key: 'New',
                        text: t(LOC_KEYS.newOptionText)
                    },
                    {
                        key: 'Existing',
                        text: t(LOC_KEYS.existingOptionText)
                    }
                ]}
                onChange={(_ev, option) => {
                    setFormMode(option.key as IFormMode);
                    setIsFormValid(false);
                }}
                selectedKey={formMode}
                styles={classNames.subComponentStyles.choiceGroup}
            />
            <UserDefinedEntityFormView
                existingEntities={entities}
                existingTypes={types}
                existingRelationshipTypes={relationshipTypes}
                formMode={formMode}
                onFormChange={onFormChange}
            />
        </CardboardModal>
    );
};

export default styled<
    IUserDefinedEntityFormProps,
    IUserDefinedEntityFormStyleProps,
    IUserDefinedEntityFormStyles
>(UserDefinedEntityForm, getFormStyles);
