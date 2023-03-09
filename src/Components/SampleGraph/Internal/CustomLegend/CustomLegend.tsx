import React from 'react';
import { classNamesFunction, styled } from '@fluentui/react';
import { Components, LegendChildrenProps } from '@antv/graphin';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import {
    ICustomLegendProps,
    ICustomLegendStyleProps,
    ICustomLegendStyles
} from './CustomLegend.types';
import { getStyles } from './CustomLegend.styles';
const { Legend } = Components;

const debugLogging = false;
const logDebugConsole = getDebugLogger('CustomLegend', debugLogging);

const getClassNames = classNamesFunction<
    ICustomLegendStyleProps,
    ICustomLegendStyles
>();

const CustomLegend: React.FC<ICustomLegendProps> = (props) => {
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

    return (
        <div className={classNames.root}>
            <Legend bindType={'edge'} sortKey={'data.type'}>
                {/* TODO: write custom legend node */}
                {(renderProps: LegendChildrenProps) => {
                    return (
                        <Legend.Node
                            {...renderProps}
                            onChange={(checked, types) => {
                                console.log(
                                    'Clicked item {checked, types}',
                                    checked,
                                    types
                                );
                            }}
                        />
                    );
                }}
            </Legend>
        </div>
    );
};

export default styled<
    ICustomLegendProps,
    ICustomLegendStyleProps,
    ICustomLegendStyles
>(CustomLegend, getStyles);
