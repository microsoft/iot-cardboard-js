import React, { useMemo } from 'react';
import {
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
} from './WizardShell.types';
import { getStyles } from './WizardShell.styles';
import { classNamesFunction, Stack, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useWizardNavigationContext } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import StepperWizard from '../StepperWizard/StepperWizard';
import { StepperWizardType } from '../StepperWizard/StepperWizard.types';
import DataSourceStep from './Internal/DataSourceStep/DataSourceStep';
import TwinVerificationStep from './Internal/TwinVerificationStep/TwinVerificationStep';
import RelationshipBuilderStep from './Internal/RelationshipBuilderStep/RelationshipBuilderStep';
import SaveStep from './Internal/SaveStep/SaveStep';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardShell', debugLogging);

const getClassNames = classNamesFunction<
    IWizardShellStyleProps,
    IWizardShellStyles
>();

const WizardShell: React.FC<IWizardShellProps> = (props) => {
    const { styles } = props;

    // contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // Memo
    const currentPage = useMemo(() => {
        switch (wizardNavigationContextState.currentStep) {
            // Create pages here
            case 0:
                return <DataSourceStep />;
            case 1:
                return <TwinVerificationStep />;
            case 2:
                return <RelationshipBuilderStep />;
            case 3:
                return <SaveStep />;
        }
    }, [wizardNavigationContextState.currentStep]);

    logDebugConsole('debug', 'Render');

    return (
        <Stack
            horizontal={true}
            tokens={{ childrenGap: 8 }}
            className={classNames.root}
        >
            <StepperWizard
                steps={wizardNavigationContextState.steps}
                type={StepperWizardType.Vertical}
                currentStepIndex={wizardNavigationContextState.currentStep}
            />
            {currentPage}
        </Stack>
    );
};

export default styled<
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
>(WizardShell, getStyles);
