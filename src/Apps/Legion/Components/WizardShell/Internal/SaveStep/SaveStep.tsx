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

    return (
        <div className={classNames.root}>
            <Stack>
                <p>{'6 Entities created'}</p>
                <p>{'  - 5 Discovered'}</p>
                <p>{'  - 1 Manually created'}</p>
                <p>{'3 Types created'}</p>
                <p>{'  - 2 time series entities'}</p>
                <p>{'  - 1 user-defined entity'}</p>
            </Stack>
        </div>
    );
};

export default styled<ISaveStepProps, ISaveStepStyleProps, ISaveStepStyles>(
    SaveStep,
    getStyles
);
