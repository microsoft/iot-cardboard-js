import React, { useMemo } from 'react';
import { IWizardShellProps } from './WizardShell.types';
import { getStyles } from './WizardShell.styles';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useWizardNavigationContext } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import StepperWizard from '../StepperWizard/StepperWizard';
import { StepperWizardType } from '../StepperWizard/StepperWizard.types';
import DataSourceStep from './Internal/DataSourceStep/DataSourceStep';
import SaveStep from './Internal/SaveStep/SaveStep';
import { DefaultButton, Icon, PrimaryButton } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import ModifyStep from './Internal/ModifyStep/ModifyStep';
import { WizardStepNumber } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardShell', debugLogging);

const WizardShell: React.FC<IWizardShellProps> = (_props) => {
    // contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();
    const { appDataState } = useAppDataContext();

    // hooks
    const theme = useExtendedTheme();
    const { t } = useTranslation();

    // callbacks

    // styles
    const classNames = getStyles(
        theme,
        !!wizardNavigationContextState.secondaryActions?.length
    );

    // Memo
    const currentPage = useMemo(() => {
        switch (wizardNavigationContextState.currentStep) {
            case WizardStepNumber.AddSource:
                return <DataSourceStep />;
            case WizardStepNumber.Modify:
                // TODO: Change show diagram based on type of asset selected
                return <ModifyStep showDiagram={false} />;
            case WizardStepNumber.Save:
                return <SaveStep />;
        }
    }, [wizardNavigationContextState.currentStep]);

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
                <h3 className={classNames.headerText}>
                    {appDataState?.targetDatabase?.databaseName}
                </h3>
            </div>
            {/* Content */}
            <div className={classNames.wizardContainer}>{currentPage}</div>
            {/* Footer */}
            <div className={classNames.footer}>
                {wizardNavigationContextState.secondaryActions ? (
                    <div className={classNames.additionalButtonsContainer}>
                        {wizardNavigationContextState.secondaryActions.map(
                            (sa) => (
                                <DefaultButton
                                    onClick={sa.onClick}
                                    disabled={sa.disabled}
                                    text={sa.text}
                                    iconProps={{ iconName: sa.iconName }}
                                />
                            )
                        )}
                    </div>
                ) : null}
                <div className={classNames.nextButtonContainer}>
                    <PrimaryButton
                        onClick={
                            wizardNavigationContextState.primaryAction?.onClick
                        }
                        disabled={
                            wizardNavigationContextState.primaryAction?.disabled
                        }
                        text={
                            wizardNavigationContextState.primaryAction?.text ??
                            t('next')
                        }
                        iconProps={{
                            iconName:
                                wizardNavigationContextState.primaryAction
                                    ?.iconName
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WizardShell;
