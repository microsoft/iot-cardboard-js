import React from 'react';
import {
    ISaveStepProps,
    ISaveStepStyleProps,
    ISaveStepStyles
} from './SaveStep.types';
import { getStyles } from './SaveStep.styles';
import { Stack, classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import {
    IWizardAction,
    WizardStepNumber
} from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useCustomNavigation } from '../../../../Hooks/useCustomNavigation';
import { useEntities } from '../../../../Hooks/useEntities';
import { useTypes } from '../../../../Hooks/useTypes';
import { useRelationships } from '../../../../Hooks/useRelationships';

const debugLogging = false;
const logDebugConsole = getDebugLogger('SaveStep', debugLogging);

const getClassNames = classNamesFunction<
    ISaveStepStyleProps,
    ISaveStepStyles
>();

const SaveStep: React.FC<ISaveStepProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks
    const { getTypeCounts } = useTypes();
    const { getEntityCounts } = useEntities();
    const { getRelationshipCounts } = useRelationships();
    const { t } = useTranslation();

    /** Register wizard buttons */
    const primaryAction: IWizardAction = {
        disabled: false,
        onClick: () => {
            logDebugConsole('debug', 'Save clicked');
        },
        iconName: 'Save',
        text: t('save')
    };
    useCustomNavigation(WizardStepNumber.Save, primaryAction, null);

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    const { created: createdEntities } = getEntityCounts();
    const { created: createdTypes } = getTypeCounts();
    const { created: createdRelationships } = getRelationshipCounts();

    return (
        <div className={classNames.root}>
            <Stack>
                <p>
                    {createdEntities > 0 &&
                        (createdEntities === 1
                            ? t('legionApp.saveStep.entityCreated', {
                                  entityCount: createdEntities
                              })
                            : t('legionApp.saveStep.entitiesCreated', {
                                  entityCount: createdEntities
                              }))}
                </p>
                <p>
                    {createdTypes > 0 &&
                        (createdTypes === 1
                            ? t('legionApp.saveStep.typeCreated', {
                                  typeCount: createdTypes
                              })
                            : t('legionApp.saveStep.typesCreated', {
                                  typeCount: createdTypes
                              }))}
                </p>
                <p>
                    {createdRelationships > 0 &&
                        (createdRelationships === 1
                            ? t('legionApp.saveStep.relationshipCreated', {
                                  relationshipCount: createdRelationships
                              })
                            : t('legionApp.saveStep.relationshipsCreated', {
                                  relationshipCount: createdRelationships
                              }))}
                </p>
            </Stack>
        </div>
    );
};

export default styled<ISaveStepProps, ISaveStepStyleProps, ISaveStepStyles>(
    SaveStep,
    getStyles
);
