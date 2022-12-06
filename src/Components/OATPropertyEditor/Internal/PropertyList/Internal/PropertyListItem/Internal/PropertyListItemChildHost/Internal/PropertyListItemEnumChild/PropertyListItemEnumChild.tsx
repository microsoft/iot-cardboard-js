import React from 'react';
import {
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { getStyles } from './PropertyListItemEnumChild.styles';
import { classNamesFunction, Separator, Stack, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyIcon from '../../../PropertyIcon/PropertyIcon';

const getClassNames = classNamesFunction<
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>();

const PropertyListItemEnumChild: React.FC<IPropertyListItemEnumChildProps> = (
    props
) => {
    const { enumType, item, level, styles } = props;

    // contexts

    // state

    // hooks

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme(),
        level: level + 1
    });

    return (
        <Stack horizontal className={classNames.root}>
            <PropertyIcon
                schema={enumType}
                styles={classNames.subComponentStyles.icon}
            />
            <div className={classNames.container}>
                <span className={classNames.name}>{item.name}:</span>
                <span className={classNames.value}>{item.enumValue}</span>
            </div>
        </Stack>
    );
};

export default styled<
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>(PropertyListItemEnumChild, getStyles);
