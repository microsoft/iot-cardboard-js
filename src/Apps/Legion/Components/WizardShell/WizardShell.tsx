import React, { useMemo } from 'react';
import {
    classNamesFunction,
    DialogFooter,
    PrimaryButton,
    Separator,
    Stack,
    styled
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
} from './WizardShell.types';
import { getStyles } from './WizardShell.styles';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { useWizardNavigationContext } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import StepperWizard from '../StepperWizard/StepperWizard';
import { StepperWizardType } from '../StepperWizard/StepperWizard.types';
import DataSourceStep from './Internal/DataSourceStep/DataSourceStep';
import TwinVerificationStep from './Internal/TwinVerificationStep/TwinVerificationStep';
import RelationshipBuilderStep from './Internal/RelationshipBuilderStep/RelationshipBuilderStep';
import SaveStep from './Internal/SaveStep/SaveStep';
import { WizardNavigationContextActionType } from '../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';

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
        <Stack
            horizontal={true}
            tokens={{ childrenGap: 8 }}
            className={classNames.root}
        >
            <div className={classNames.wizardContainer}>
                <StepperWizard
                    steps={wizardNavigationContextState.steps}
                    type={StepperWizardType.Vertical}
                    currentStepIndex={wizardNavigationContextState.currentStep}
                />
            </div>
            <Separator vertical={true} />
            <Stack tokens={{ childrenGap: 8 }} className={classNames.content}>
                {/* Content */}
                <Stack.Item grow>{currentPage}</Stack.Item>
                {/* Page footer */}
                <Footer />
            </Stack>
        </Stack>
    );
};

const Footer: React.FC = () => {
    // hooks
    const { t } = useTranslation();

    // contexts
    const {
        wizardNavigationContextState,
        wizardNavigationContextDispatch
    } = useWizardNavigationContext();

    if (
        wizardNavigationContextState.currentStep !==
        wizardNavigationContextState.steps?.length - 1
    ) {
        return (
            <DialogFooter>
                <PrimaryButton
                    text={t('next')}
                    disabled={!wizardNavigationContextState.validity.isValid}
                    onClick={() => {
                        wizardNavigationContextDispatch({
                            type: WizardNavigationContextActionType.NAVIGATE_TO,
                            payload: {
                                stepNumber:
                                    wizardNavigationContextState.currentStep + 1
                            }
                        });
                    }}
                />
            </DialogFooter>
        );
    }

    return (
        <DialogFooter>
            <PrimaryButton
                text={t('save')}
                onClick={() => alert('Congratulations!!! You did it.')}
            />
        </DialogFooter>
    );
};

export default styled<
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
>(WizardShell, getStyles);
