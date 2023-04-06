import React from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    IFlowPickerPageProps,
    IFlowPickerPageStyleProps,
    IFlowPickerPageStyles
} from './FlowPickerPage.types';
import { getStyles } from './FlowPickerPage.styles';

const debugLogging = false;
const logDebugConsole = getDebugLogger('FlowPickerPage', debugLogging);

const getClassNames = classNamesFunction<
    IFlowPickerPageStyleProps,
    IFlowPickerPageStyles
>();

const FlowPickerPage: React.FC<IFlowPickerPageProps> = (props) => {
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

    return <div className={classNames.root}>Hello FlowPickerPage!</div>;
};

export default styled<
    IFlowPickerPageProps,
    IFlowPickerPageStyleProps,
    IFlowPickerPageStyles
>(FlowPickerPage, getStyles);
