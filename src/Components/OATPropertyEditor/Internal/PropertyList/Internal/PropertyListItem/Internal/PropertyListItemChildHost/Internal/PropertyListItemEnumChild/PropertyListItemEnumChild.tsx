import React from 'react';
import {
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { getStyles } from './PropertyListItemEnumChild.styles';
import { classNamesFunction, Stack, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyIcon from '../../../PropertyIcon/PropertyIcon';

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
        <Stack horizontal className={classNames.root}>
            <PropertyIcon schema={enumType} />
            <span>Name: {item.name}</span>
            <span>Value: {item.enumValue}</span>
        </Stack>
    );
};

export default styled<
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>(PropertyListItemEnumChild, getStyles);
