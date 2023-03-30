import React from 'react';
import {
    ITwinVerificationStepProps,
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
} from './TwinVerificationStep.types';
import { getStyles } from './TwinVerificationStep.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';

const debugLogging = false;
const logDebugConsole = getDebugLogger('TwinVerificationStep', debugLogging);

const getClassNames = classNamesFunction<
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
>();

const TwinVerificationStep: React.FC<ITwinVerificationStepProps> = (props) => {
    const { styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return <div className={classNames.root}>Hello TwinVerificationStep!</div>;
};

export default styled<
    ITwinVerificationStepProps,
    ITwinVerificationStepStyleProps,
    ITwinVerificationStepStyles
>(TwinVerificationStep, getStyles);
