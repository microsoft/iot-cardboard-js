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

    const { new: newEntities } = getEntityCounts();
    const { new: newTypes } = getTypeCounts();
    const { new: newRelationships } = getRelationshipCounts();

    return (
        <div className={classNames.root}>
            <Stack>
                <p>
                    {newEntities > 0 &&
                        (newEntities === 1
                            ? t('legionApp.saveStep.entityCreated', {
                                  entityCount: newEntities
                              })
                            : t('legionApp.saveStep.entitiesCreated', {
                                  entityCount: newEntities
                              }))}
                </p>
                <p>
                    {newTypes > 0 &&
                        (newTypes === 1
                            ? t('legionApp.saveStep.typeCreated', {
                                  typeCount: newTypes
                              })
                            : t('legionApp.saveStep.typesCreated', {
                                  typeCount: newTypes
                              }))}
                </p>
                <p>
                    {newRelationships > 0 &&
                        (newRelationships === 1
                            ? t('legionApp.saveStep.relationshipCreated', {
                                  relationshipCount: newRelationships
                              })
                            : t('legionApp.saveStep.relationshipCreated', {
                                  relationshipCount: newRelationships
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
