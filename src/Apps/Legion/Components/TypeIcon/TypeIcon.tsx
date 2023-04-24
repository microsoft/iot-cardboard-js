import React from 'react';
import { ITypeIconProps } from './TypeIcon.types';
import { getStyles } from './TypeIcon.styles';
import { Icon } from '@fluentui/react';

const TypeIcon: React.FC<ITypeIconProps> = (props) => {
    // Props
    const { color, icon } = props;
    // Styles
    const classNames = getStyles(color);

    return (
        <span className={classNames.root}>
            <Icon className={classNames.icon} iconName={icon} />
        </span>
    );
};

export default TypeIcon;
