import React, { useMemo } from 'react';
import { IWizardShellProps } from './WizardShell.types';
import { getStyles } from './WizardShell.styles';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useWizardNavigationContext } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import StepperWizard from '../StepperWizard/StepperWizard';
import { StepperWizardType } from '../StepperWizard/StepperWizard.types';
import DataSourceStep from './Internal/DataSourceStep/DataSourceStep';
import TwinVerificationStep from './Internal/TwinVerificationStep/TwinVerificationStep';
import RelationshipBuilderStep from './Internal/RelationshipBuilderStep/RelationshipBuilderStep';
import SaveStep from './Internal/SaveStep/SaveStep';
import { Icon, PrimaryButton } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardShell', debugLogging);

const WizardShell: React.FC<IWizardShellProps> = (_props) => {
    // contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

    // hooks
    const theme = useExtendedTheme();
    const { t } = useTranslation();

    // callbacks

    // styles
    const classNames = getStyles(theme);

    // Memo
    const currentPage = useMemo(() => {
        switch (wizardNavigationContextState.currentStep) {
            // Create pages here
            case 0:
                return (
                    <DataSourceStep
                        adapter={wizardNavigationContextState.adapter}
                    />
                );
            case 1:
                return <TwinVerificationStep />;
            case 2:
                return <RelationshipBuilderStep />;
            case 3:
                return <SaveStep />;
        }
    }, [
        wizardNavigationContextState.adapter,
        wizardNavigationContextState.currentStep
    ]);

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            {/* Left nav */}
            <div className={classNames.leftNav}>
                <StepperWizard
                    steps={wizardNavigationContextState.steps}
                    type={StepperWizardType.Vertical}
                    currentStepIndex={wizardNavigationContextState.currentStep}
                />
            </div>
            {/* Top nav */}
            <div className={classNames.headerNav}>
                {/* TODO: CREATE DB HEADER */}
                <Icon iconName={'Globe'} />
                <h3 className={classNames.headerText}>DATABASE NAME HERE</h3>
            </div>
            {/* Content */}
            <div className={classNames.wizardContainer}>{currentPage}</div>
            {/* Footer */}
            <div className={classNames.footer}>
                {/* TODO: Container for more that one button */}
                <div className={classNames.nextButtonContainer}>
                    <PrimaryButton
                        onClick={
                            wizardNavigationContextState.primaryAction?.onClick
                        }
                        disabled={
                            wizardNavigationContextState.primaryAction?.disabled
                        }
                        text={t('next')}
                    />
                </div>
            </div>
        </div>
    );
};

export default WizardShell;
