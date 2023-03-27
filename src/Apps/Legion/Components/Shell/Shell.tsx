import React from 'react';
import { IShellProps, IShellStyleProps, IShellStyles } from './Shell.types';
import { getStyles } from './Shell.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('Shell', debugLogging);

const getClassNames = classNamesFunction<IShellStyleProps, IShellStyles>();

const Shell: React.FC<IShellProps> = (props) => {
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

    return <div className={classNames.root}>Hello Shell!</div>;
};

export default styled<IShellProps, IShellStyleProps, IShellStyles>(
    Shell,
    getStyles
);
