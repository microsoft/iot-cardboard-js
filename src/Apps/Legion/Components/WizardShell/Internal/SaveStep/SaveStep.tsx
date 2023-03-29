import React from 'react';
import {
    ISaveStepProps,
    ISaveStepStyleProps,
    ISaveStepStyles
} from './SaveStep.types';
import { getStyles } from './SaveStep.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';

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

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    logDebugConsole('debug', 'Render');

    return <div className={classNames.root}>Hello SaveStep!</div>;
};

export default styled<ISaveStepProps, ISaveStepStyleProps, ISaveStepStyles>(
    SaveStep,
    getStyles
);
