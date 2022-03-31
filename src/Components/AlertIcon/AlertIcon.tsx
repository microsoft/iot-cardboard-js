import { classNamesFunction, Icon, styled, useTheme } from '@fluentui/react';
import React from 'react';
import { getStyles } from './AlertIcon.styles';
import {
    IAlertIconStyleProps,
    IAlertIconStyles,
    IAlertIconProps
} from './AlertIcon.types';

const getClassNames = classNamesFunction<
    IAlertIconStyleProps,
    IAlertIconStyles
>();

const AlertIcon: React.FC<IAlertIconProps> = (props) => {
    const { color, icon, styles } = props;
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme,
        color: color
    });
    return (
        <div className={classNames.root}>
            <Icon iconName={icon} color={color} />
        </div>
    );
};

export default styled<IAlertIconProps, IAlertIconStyleProps, IAlertIconStyles>(
    AlertIcon,
    getStyles
);
