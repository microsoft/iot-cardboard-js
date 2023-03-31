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
    styled
} from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';
import { ModelLists } from './Internal/ModelLists';
import { TwinLists } from './Internal/TwinLists';
import { useWizardNavigationContext } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext';
import { WizardNavigationContextActionType } from '../../../../Models/Context/WizardNavigationContext/WizardNavigationContext.types';

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
            <div className={classNames.headerContainer}>
                {/* TODO: Translate */}
                <h1>Verify discovered twins</h1>
            </div>
            <div className={classNames.content}>
                <Pivot selectedKey={selectedKey} onLinkClick={onPivotClick}>
                    <PivotItem
                        title="Models"
                        headerText="Models"
                        itemKey={PivotKeys.Models}
                    >
                        {/* Models */}
                        <ModelLists />
                        <PrimaryButton
                            text="Next"
                            styles={classNames.subComponentStyles.button()}
                            onClick={onFirstButtonClick}
                        />
                    </PivotItem>
                    <PivotItem
                        title="Twins"
                        headerText="Twins"
                        itemKey={PivotKeys.Twins}
                    >
                        {/* Twins */}
                        <TwinLists />
                        <PrimaryButton
                            text="Next"
                            styles={classNames.subComponentStyles.button()}
                            onClick={onFinishButtonClick}
                        />
                    </PivotItem>
                </Pivot>
            </div>
        </div>
    );
};

export default styled<
    ITwinVerificationStepProps,
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
>(TwinVerificationStep, getStyles);
