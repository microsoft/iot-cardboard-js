import React, { useState } from 'react';
import {
    ITwinVerificationStepProps,
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
} from './TwinVerificationStep.types';
import { getStyles } from './TwinVerificationStep.styles';
import {
    classNamesFunction,
    Pivot,
    PivotItem,
    PrimaryButton,
    Stack,
    styled
} from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { ModelLists } from './Internal/ModelLists';
import { TwinLists } from './Internal/TwinLists';
import { useWizardNavigationContext } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../../Contexts/WizardNavigationContext/WizardNavigationContext.types';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TwinVerificationStep', debugLogging);

const getClassNames = classNamesFunction<
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
>();

enum PivotKeys {
    Models = 'Models',
    Twins = 'Twins'
}

const TwinVerificationStep: React.FC<ITwinVerificationStepProps> = (props) => {
    const { styles } = props;

    // contexts
    const { wizardNavigationContextDispatch } = useWizardNavigationContext();

    // state
    const [selectedKey, setSelectedKey] = useState<PivotKeys>(PivotKeys.Models);

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onFirstButtonClick = () => {
        if (PivotKeys.Twins == selectedKey) {
            return;
        }
        setSelectedKey(PivotKeys.Twins);
    };

    const onFinishButtonClick = () => {
        wizardNavigationContextDispatch({
            type: WizardNavigationContextActionType.NAVIGATE_TO,
            payload: { stepNumber: 2 }
        });
    };

    const onPivotClick = (item: PivotItem) => {
        const selectedPivot = item.props.itemKey as PivotKeys;
        if (selectedPivot == selectedKey) {
            return;
        }
        setSelectedKey(selectedPivot);
    };

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Stack>
                <div className={classNames.headerContainer}>
                    <h1>{t('legionApp.verificationStep.title')}</h1>
                </div>
                <div className={classNames.content}>
                    <Pivot selectedKey={selectedKey} onLinkClick={onPivotClick}>
                        <PivotItem
                            title={t('legionApp.verificationStep.models')}
                            headerText={t('legionApp.verificationStep.models')}
                            itemKey={PivotKeys.Models}
                        >
                            {/* Models */}
                            <Stack tokens={{ childrenGap: 8 }}>
                                <ModelLists />
                                <div className={classNames.buttonContainer}>
                                    <PrimaryButton
                                        text={t('next')}
                                        onClick={onFirstButtonClick}
                                    />
                                </div>
                            </Stack>
                        </PivotItem>
                        <PivotItem
                            title={t('legionApp.verificationStep.twins')}
                            headerText={t('legionApp.verificationStep.twins')}
                            itemKey={PivotKeys.Twins}
                        >
                            {/* Twins */}
                            <Stack tokens={{ childrenGap: 8 }}>
                                <TwinLists />
                                <div className={classNames.buttonContainer}>
                                    <PrimaryButton
                                        text={t('next')}
                                        onClick={onFinishButtonClick}
                                    />
                                </div>
                            </Stack>
                        </PivotItem>
                    </Pivot>
                </div>
            </Stack>
        </div>
    );
};

export default styled<
    ITwinVerificationStepProps,
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
>(TwinVerificationStep, getStyles);
