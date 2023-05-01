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
    const { getTypeCountsByKind, getTotalTypeCount } = useTypes();
    const { getEntityCount, getTotalEntityCount } = useEntities();
    const { t } = useTranslation();

    /** Register wizard buttons */
    const primaryAction: IWizardAction = {
        disabled: false,
        onClick: () => {
            console.log('Save clicked');
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

    // TODO Ambika: Do we need deletedEntities?
    const { new: newEntities, existing: existingEntities } = getEntityCount();
    const totalEntities = getTotalEntityCount();
    const {
        userDefined: userDefinedTypes,
        timeSeries: timeSeriesTypes
    } = getTypeCountsByKind();
    const totalTypes = getTotalTypeCount();

    return (
        <div className={classNames.root}>
            <Stack>
                <p>
                    {totalEntities === 1
                        ? t('legionApp.saveStep.entityCreated', {
                              entityCount: totalEntities
                          })
                        : t('legionApp.saveStep.entitiesCreated', {
                              entityCount: totalEntities
                          })}
                </p>
                <Stack>
                    <p>
                        {newEntities === 1
                            ? t('legionApp.saveStep.newEntity', {
                                  entityCount: newEntities
                              })
                            : t('legionApp.saveStep.newEntities', {
                                  entityCount: newEntities
                              })}
                    </p>
                    <p>
                        {existingEntities === 1
                            ? t('legionApp.saveStep.existingEntity', {
                                  entityCount: existingEntities
                              })
                            : t('legionApp.saveStep.existingEntities', {
                                  entityCount: existingEntities
                              })}
                    </p>
                </Stack>
                <p>
                    {totalTypes === 1
                        ? t('legionApp.saveStep.typeCreated', {
                              typeCount: totalTypes
                          })
                        : t('legionApp.saveStep.typesCreated', {
                              typeCount: totalTypes
                          })}
                </p>
                <Stack>
                    <p>
                        {userDefinedTypes > 0 &&
                            t('legionApp.saveStep.userDefined', {
                                typeCount: userDefinedTypes
                            })}
                    </p>
                    <p>
                        {timeSeriesTypes > 0 &&
                            t('legionApp.saveStep.timeSeries', {
                                typeCount: timeSeriesTypes
                            })}
                    </p>
                </Stack>
            </Stack>
        </div>
    );
};

export default styled<ISaveStepProps, ISaveStepStyleProps, ISaveStepStyles>(
    SaveStep,
    getStyles
);
