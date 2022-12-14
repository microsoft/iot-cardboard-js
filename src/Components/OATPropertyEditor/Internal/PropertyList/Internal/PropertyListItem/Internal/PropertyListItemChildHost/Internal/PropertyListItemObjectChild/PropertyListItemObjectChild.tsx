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
    const {
        indexKey,
        isFirstItem,
        isLastItem,
        item,
        level,
        onUpdateSchema,
        onReorderItem,
        onUpdateName,
        styles
    } = props;

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
                isFirstItem={isFirstItem}
                isLastItem={isLastItem}
                item={item}
                level={level + 1}
                onUpdateSchema={onUpdateSchema}
                onUpdateName={onUpdateName}
                onReorderItem={onReorderItem}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemObjectChildProps,
    IPropertyListItemObjectChildStyleProps,
    IPropertyListItemObjectChildStyles
>(PropertyListItemObjectChild, getStyles);
