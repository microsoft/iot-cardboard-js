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
import { useWizardDataManagementContext } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import { useTranslation } from 'react-i18next';
import { useGraphContext } from '../../Contexts/GraphContext/GraphContext';
import CardboardModal from '../../../../Components/CardboardModal/CardboardModal';
import { GraphContextActionType } from '../../Contexts/GraphContext/GraphContext.types';
import UserDefinedEntityFormView from './UserDefinedEntityForm.view';

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
    const {
        wizardDataManagementContextState
    } = useWizardDataManagementContext();
    const { graphState, graphDispatch } = useGraphContext();

    // data
    const {
        twins: entities,
        models: types,
        relationshipModels: relationships
    } = wizardDataManagementContextState.modifiedAssets;

    // state
    const [formData, setFormData] = useState<IFormData>(null);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [formMode, setFormMode] = useState<IFormMode>('New');

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onFormChange = useCallback((formData: IFormChangeArgs) => {
        setFormData(formData.data);
        setIsFormValid(formData.isValid);
        logDebugConsole('debug', 'Form data change. {data}', formData);
    }, []);

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
                text: t(LOC_KEYS.actionButtonText)
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
                existingRelationships={relationships}
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
