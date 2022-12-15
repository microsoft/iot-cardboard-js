import React, { useState } from 'react';
import {
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
} from './PropertyListItemEnumChild.types';
import { getStyles } from './PropertyListItemEnumChild.styles';
import {
    classNamesFunction,
    SpinButton,
    Stack,
    styled,
    TextField
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../../../Models/Hooks/useExtendedTheme';
import PropertyIcon from '../../../PropertyIcon/PropertyIcon';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>();

const PropertyListItemEnumChild: React.FC<IPropertyListItemEnumChildProps> = (
    props
) => {
    const { enumType, item, level, onUpdateKey, onUpdateValue, styles } = props;

    // contexts

    // state
    const [name, setName] = useState(item.name);
    const [value, setValue] = useState(item.enumValue);

    // hooks
    const { t } = useTranslation();

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
            <Stack
                className={classNames.container}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <TextField
                    value={name}
                    onChange={(_ev, value) => setName(value)}
                    onBlur={() => onUpdateKey(name)}
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
                        onBlur={() => onUpdateValue(value)}
                        placeholder={t(
                            'OATPropertyEditor.PropertyListItem.enumValuePlaceholder'
                        )}
                        styles={classNames.subComponentStyles.valueTextField}
                    />
                )}
            </Stack>
        </Stack>
    );
};

export default styled<
    IPropertyListItemEnumChildProps,
    IPropertyListItemEnumChildStyleProps,
    IPropertyListItemEnumChildStyles
>(PropertyListItemEnumChild, getStyles);
