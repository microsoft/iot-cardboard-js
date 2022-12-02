import React from 'react';
import {
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { getStyles } from './PropertyListItemEnumChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>();

const PropertyListItemEnumChild: React.FC<IPropertyListItemEnumChildProps> = (
    props
) => {
    const { enumType, item, styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            <span>Type: {enumType}, </span>
            <span>Value: {item.enumValue}</span>
        </div>
    );
};

export default styled<
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>(PropertyListItemEnumChild, getStyles);
