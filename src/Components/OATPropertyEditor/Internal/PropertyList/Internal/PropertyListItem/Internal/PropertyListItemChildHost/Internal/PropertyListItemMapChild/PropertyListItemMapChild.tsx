import React from 'react';
import {
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
} from './PropertyListItemMapChild.types';
import { getStyles } from './PropertyListItemMapChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';

const getClassNames = classNamesFunction<
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>();

const PropertyListItemMapChild: React.FC<IPropertyListItemMapChildProps> = (
    props
) => {
    const { item, indexKey, level, styles } = props;

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
                indexKey={`${indexKey}.0`}
                item={item.mapKey}
                level={level + 1}
            />
            <PropertyListItem
                indexKey={`${indexKey}.0`}
                item={item.mapValue}
                level={level + 1}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>(PropertyListItemMapChild, getStyles);
