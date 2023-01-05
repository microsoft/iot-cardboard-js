import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { getStyles } from './PropertyListItemEnumChild.styles';
import {
    classNamesFunction,
    IContextualMenuItem,
    SpinButton,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyIcon from '../../../PropertyIcon/PropertyIcon';
import { useTranslation } from 'react-i18next';
import { OverflowMenu } from '../../../../../../../../../OverflowMenu/OverflowMenu';

const getClassNames = classNamesFunction<
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>();

const PropertyListItemEnumChild: React.FC<IPropertyListItemEnumChildProps> = (
    props
) => {
    const {
        enumType,
        indexKey,
        isFirstItem,
        isLastItem,
        item,
        level,
        onUpdateKey,
        onUpdateValue,
        onReorderItem,
        onRemove,
        styles
    } = props;

    // contexts

    // state
    const [name, setName] = useState(item.name);
    const [value, setValue] = useState(item.enumValue);

    // hooks
    const { t } = useTranslation();

    // callbacks

    const onMoveUp = onReorderItem
        ? useCallback(() => {
              onReorderItem('Up');
          }, [onReorderItem])
        : undefined;
    const onMoveDown = onReorderItem
        ? useCallback(() => {
              onReorderItem('Down');
          }, [onReorderItem])
        : undefined;

    // side effects
    useEffect(() => {
        setName(item.name);
    }, [item.name]);
    useEffect(() => {
        setValue(item.enumValue);
    }, [item.enumValue]);

    // data
    const overflowMenuItems: IContextualMenuItem[] = useMemo(
        () => [
            {
                key: 'move-up',
                text: 'Move up',
                disabled: isFirstItem,
                iconProps: { iconName: 'Up' },
                onClick: onMoveUp
            },
            {
                key: 'move-down',
                text: 'Move down',
                disabled: isLastItem,
                iconProps: { iconName: 'Down' },
                onClick: onMoveDown
            },
            {
                key: 'remove',
                text: 'Remove',
                disabled: !onRemove,
                iconProps: { iconName: 'Delete' },
                onClick: onRemove
            }
        ],
        [isFirstItem, isLastItem, onMoveDown, onMoveUp, onRemove]
    );

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme(),
        level: level + 1
    });

    return (
        <Stack
            horizontal
            className={classNames.root}
            tokens={{ childrenGap: 4 }}
        >
            <PropertyIcon
                schema={enumType}
                styles={classNames.subComponentStyles.icon}
            />
            <TextField
                value={name}
                onChange={(_ev, value) => setName(value)}
                onBlur={() => {
                    // only trigger an update if the value really changed. Otherwise it fires every time you leave the field
                    if (name !== item.name) {
                        onUpdateKey(name);
                    }
                }}
                placeholder={t(
                    'OATPropertyEditor.PropertyListItem.enumKeyPlaceholder'
                )}
                styles={classNames.subComponentStyles.keyField}
            />
            {enumType === 'integer' ? (
                <SpinButton
                    value={String(item.enumValue)}
                    onChange={(_ev, value) => onUpdateValue(Number(value))}
                    styles={classNames.subComponentStyles.valueNumberField}
                />
            ) : (
                <TextField
                    value={value as string}
                    onChange={(_ev, value) => setValue(value)}
                    onBlur={() => {
                        if (value !== item.enumValue) {
                            onUpdateValue(value);
                        }
                    }}
                    placeholder={t(
                        'OATPropertyEditor.PropertyListItem.enumValuePlaceholder'
                    )}
                    styles={classNames.subComponentStyles.valueTextField}
                />
            )}
            <span className={classNames.buttonSpacer} />
            <OverflowMenu
                index={indexKey}
                isFocusable={true}
                menuKey={'enum-child-values-list'}
                menuProps={{
                    items: overflowMenuItems
                }}
            />
        </Stack>
    );
};

export default styled<
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>(PropertyListItemEnumChild, getStyles);
