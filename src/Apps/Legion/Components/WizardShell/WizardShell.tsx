import React, { useCallback, useMemo, useReducer } from 'react';
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
import {
    NextButtonReducerActionType,
    defaultNextButtonState,
    nextButtonReducer
} from './Internal/NextButton.state';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardShell', debugLogging);

const WizardShell: React.FC<IWizardShellProps> = (_props) => {
    // contexts
    const { wizardNavigationContextState } = useWizardNavigationContext();

    // state-reducer
    const [state, nextButtonDispatch] = useReducer(
        nextButtonReducer,
        defaultNextButtonState
    );

    // hooks
    const theme = useExtendedTheme();

    // callbacks
    const registerNextButtonClick = useCallback((fn: VoidFunction) => {
        nextButtonDispatch({
            type: NextButtonReducerActionType.SET_ON_CLICK_FUNCTION,
            payload: { onClickFn: fn }
        });
    }, []);

    const setIsButtonDisabled = useCallback((isDisabled: boolean) => {
        nextButtonDispatch({
            type: NextButtonReducerActionType.SET_IS_DISABLED,
            payload: { isDisabled }
        });
    }, []);

    // side effects

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
                        registerNextButtonClick={registerNextButtonClick}
                        setIsButtonDisabled={setIsButtonDisabled}
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
        wizardNavigationContextState.currentStep,
        registerNextButtonClick,
        setIsButtonDisabled
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
                <div className={classNames.nextButtonContainer}>
                    <PrimaryButton
                        onClick={state.onClick}
                        disabled={state.isDisabled}
                        text="Next"
                    />
                </div>
            </div>
        </div>
    );
};

export default WizardShell;
