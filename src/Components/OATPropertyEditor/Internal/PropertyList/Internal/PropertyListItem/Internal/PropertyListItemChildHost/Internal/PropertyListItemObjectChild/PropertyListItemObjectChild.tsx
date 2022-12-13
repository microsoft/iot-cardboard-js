import React from 'react';
import {
    IPropertyListItemObjectChildProps,
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
} from './PropertyListItemObjectChild.types';
import { getStyles } from './PropertyListItemObjectChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';

const getClassNames = classNamesFunction<
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
>();

const PropertyListItemObjectChild: React.FC<IPropertyListItemObjectChildProps> = (
    props
) => {
    const { indexKey, item, level, onUpdateItem, styles } = props;

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
            <PropertyListItem
                indexKey={indexKey}
                item={item}
                level={level + 1}
                onUpdateItem={onUpdateItem}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemObjectChildProps,
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
>(PropertyListItemObjectChild, getStyles);
