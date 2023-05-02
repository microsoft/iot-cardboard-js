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
    const { getNewTypeCount } = useTypes();
    const { getNewEntityCount } = useEntities();
    const { getNewRelationshipCount } = useRelationships();
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

    const totalEntities = getNewEntityCount();
    const totalTypes = getNewTypeCount();
    const totalRelationships = getNewRelationshipCount();

    return (
        <div className={classNames.root}>
            <Stack>
                <p>
                    {totalEntities > 0 &&
                        (totalEntities === 1
                            ? t('legionApp.saveStep.entityCreated', {
                                  entityCount: totalEntities
                              })
                            : t('legionApp.saveStep.entitiesCreated', {
                                  entityCount: totalEntities
                              }))}
                </p>
                <p>
                    {totalTypes > 0 &&
                        (totalTypes === 1
                            ? t('legionApp.saveStep.typeCreated', {
                                  typeCount: totalTypes
                              })
                            : t('legionApp.saveStep.typesCreated', {
                                  typeCount: totalTypes
                              }))}
                </p>
                <p>
                    {totalRelationships > 0 &&
                        (totalRelationships === 1
                            ? t('legionApp.saveStep.relationshipCreated', {
                                  relationshipCount: totalRelationships
                              })
                            : t('legionApp.saveStep.relationshipCreated', {
                                  relationshipCount: totalRelationships
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
