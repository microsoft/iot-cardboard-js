import React from 'react';
import {
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
} from './DataSourceStep.types';
import { getStyles } from './DataSourceStep.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { getDebugLogger } from '../../../../../../Models/Services/Utils';
import { useExtendedTheme } from '../../../../../../Models/Hooks/useExtendedTheme';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DataSourceStep', debugLogging);

const getClassNames = classNamesFunction<
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>();

const DataSourceStep: React.FC<IDataSourceStepProps> = (props) => {
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

    return <div className={classNames.root}>Hello DataSourceStep!</div>;
};

export default styled<
    IDataSourceStepProps,
    IDataSourceStepStyleProps,
    IDataSourceStepStyles
>(DataSourceStep, getStyles);
