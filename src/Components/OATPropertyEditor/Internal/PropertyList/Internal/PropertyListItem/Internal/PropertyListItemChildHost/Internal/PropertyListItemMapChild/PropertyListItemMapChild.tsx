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
import { deepCopy } from '../../../../../../../../../../Models/Services/Utils';

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
                isFirstItem={true}
                isLastItem={true}
                onCopy={undefined}
                onRemove={undefined}
                onReorderItem={undefined}
                onUpdateName={undefined}
                onUpdateSchema={undefined}
            />
            <PropertyListItem
                indexKey={`${indexKey}.0`}
                item={item.mapValue}
                level={level + 1}
                isFirstItem={true}
                isLastItem={true}
                onCopy={undefined}
                onRemove={undefined}
                onReorderItem={undefined}
                onUpdateName={undefined}
                onUpdateSchema={undefined}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>(PropertyListItemMapChild, getStyles);
