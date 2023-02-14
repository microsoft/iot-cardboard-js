import React, { useCallback } from 'react';
import {
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
} from './PropertyListItemMapChild.types';
import { getStyles } from './PropertyListItemMapChild.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyListItem from '../../../../PropertyListItem';
import {
    DtdlMapKey,
    DtdlMapValue
} from '../../../../../../../../../../Models/Constants';
import { deepCopy } from '../../../../../../../../../../Models/Services/Utils';

const getClassNames = classNamesFunction<
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>();

const PropertyListItemMapChild: React.FC<IPropertyListItemMapChildProps> = (
    props
) => {
    const {
        item,
        indexKey,
        level,
        onUpdateKey,
        onUpdateValue,
        parentModelContext,
        styles
    } = props;

    // contexts

    // state

    // hooks

    // callbacks
    const onUpdateKeyInternal = useCallback(
        (key: DtdlMapKey) => {
            //
            onUpdateKey(key);
        },
        [onUpdateKey]
    );
    const onUpdateValueInternal = useCallback(
        (value: DtdlMapValue) => {
            //
            onUpdateValue(value);
        },
        [onUpdateValue]
    );

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
                onUpdateName={(args) => {
                    const keyCopy = deepCopy(item.mapKey);
                    keyCopy.name = args.name;
                    onUpdateKeyInternal(keyCopy);
                }}
                onUpdateSchema={undefined} // not allowed to change, always string
                parentModelContext={parentModelContext}
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
                onUpdateName={(args) => {
                    const valueCopy = deepCopy(item.mapValue);
                    valueCopy.name = args.name;
                    onUpdateValueInternal(valueCopy);
                }}
                onUpdateSchema={(args) => {
                    const keyCopy = deepCopy(item.mapValue);
                    keyCopy.schema = args;
                    onUpdateValueInternal(keyCopy);
                }}
                parentModelContext={parentModelContext}
            />
        </div>
    );
};

export default styled<
    IPropertyListItemMapChildProps,
    IPropertyListItemMapChildStyleProps,
    IPropertyListItemMapChildStyles
>(PropertyListItemMapChild, getStyles);
