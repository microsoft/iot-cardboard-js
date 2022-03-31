import { classNamesFunction, styled, useTheme } from '@fluentui/react';
import React from 'react';
import AlertIcon from '../../../../../AlertIcon/AlertIcon';
import { getStyles } from './AlertIconPreview.styles';
import {
    IAlertIconStylePreviewProps,
    IAlertIconPreviewStyles,
    IAlertIconPreviewProps
} from './AlertIconPreview.types';

const getClassNames = classNamesFunction<
    IAlertIconStylePreviewProps,
    IAlertIconPreviewStyles
>();

const AlertIconPreview: React.FC<IAlertIconPreviewProps> = (props) => {
    const { color, icon, styles } = props;
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });
    return (
        <div className={classNames.root}>
            <AlertIcon
                icon={icon}
                color={color}
                styles={classNames.subComponentStyles.alertIcon}
            />
        </div>
    );
};

export default styled<
    IAlertIconPreviewProps,
    IAlertIconStylePreviewProps,
    IAlertIconPreviewStyles
>(AlertIconPreview, getStyles);
