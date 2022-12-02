import React from 'react';
import {
    IPropertyListItemArrayChildProps,
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
} from './PropertyListItemArrayChild.types';
import { getStyles } from './PropertyListItemArrayChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
>();

const PropertyListItemArrayChild: React.FC<IPropertyListItemArrayChildProps> = (
    props
) => {
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

    return (
        <div className={classNames.root}>Hello PropertyListItemArrayChild!</div>
    );
};

export default styled<
    IPropertyListItemArrayChildProps,
    IPropertyListItemArrayChildStyleProps,
    IPropertyListItemArrayChildStyles
>(PropertyListItemArrayChild, getStyles);
