import React from 'react';
import {
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
} from './WizardShell.types';
import { getStyles } from './WizardShell.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('WizardShell', debugLogging);

const getClassNames = classNamesFunction<
    IWizardShellStyleProps,
    IWizardShellStyles
>();

const WizardShell: React.FC<IWizardShellProps> = (props) => {
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

    return <div className={classNames.root}>Hello WizardShell!</div>;
};

export default styled<
    IWizardShellProps,
    IWizardShellStyleProps,
    IWizardShellStyles
>(WizardShell, getStyles);
