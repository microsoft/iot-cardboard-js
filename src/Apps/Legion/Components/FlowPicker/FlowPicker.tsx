import React from 'react';
import {
    DefaultButton,
    PrimaryButton,
    Stack,
    classNamesFunction,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IFlowPickerProps,
    IFlowPickerStyleProps,
    IFlowPickerStyles
} from './FlowPicker.types';
import { getStyles } from './FlowPicker.styles';
import { WizardStepNumber } from '../../Contexts/WizardNavigationContext/WizardNavigationContext.types';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPicker', debugLogging);

const getClassNames = classNamesFunction<
    IFlowPickerStyleProps,
    IFlowPickerStyles
>();

const FlowPicker: React.FC<IFlowPickerProps> = (props) => {
    const { onNavigateBack, onNavigateNext, styles } = props;

    // contexts

    // callbacks

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return (
        <Stack className={classNames.root} tokens={{ childrenGap: 8 }}>
            <Stack tokens={{ childrenGap: 8 }}>
                <PrimaryButton
                    text={'Discover'}
                    onClick={() => onNavigateNext(WizardStepNumber.AddSource)}
                />
                <PrimaryButton
                    text={'Modify'}
                    onClick={() => onNavigateNext(WizardStepNumber.Modify)}
                />
                <PrimaryButton
                    text={'View'}
                    onClick={() => onNavigateNext(WizardStepNumber.Save)}
                />
                <DefaultButton text={'Back'} onClick={onNavigateBack} />
            </Stack>
        </Stack>
    );
};

export default styled<
    IFlowPickerProps,
    IFlowPickerStyleProps,
    IFlowPickerStyles
>(FlowPicker, getStyles);
