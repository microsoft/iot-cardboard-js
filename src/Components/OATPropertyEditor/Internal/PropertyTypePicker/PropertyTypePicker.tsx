import React, { useMemo } from 'react';
import {
    IPropertyTypePickerProps,
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
} from './PropertyTypePicker.types';
import { getStyles } from './PropertyTypePicker.styles';
import {
    classNamesFunction,
    styled,
    CommandButton,
    Stack
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { getSchemaTypeMenuOptions } from '../../../../Models/Constants/OatConstants';
import PropertyIcon from '../PropertyList/Internal/PropertyListItem/Internal/PropertyIcon/PropertyIcon';

const getClassNames = classNamesFunction<
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
>();

const PropertyTypePicker: React.FC<IPropertyTypePickerProps> = (props) => {
    const { onSelect, styles } = props;

    // contexts

    // state
    const menuOptions = useMemo(() => getSchemaTypeMenuOptions(onSelect), [
        onSelect
    ]);

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <CommandButton
            text={t('add')}
            iconProps={{ iconName: 'Add' }}
            menuProps={{
                items: menuOptions,
                contextualMenuItemAs: (props) => {
                    console.log('****rendering item', props);
                    return (
                        <Stack horizontal verticalAlign="center">
                            <PropertyIcon schema={props.item.key} />
                            {props.item.text}
                        </Stack>
                    );
                }
            }}
            styles={classNames.subComponentStyles.menu?.()}
        />
    );
};

export default styled<
    IPropertyTypePickerProps,
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
>(PropertyTypePicker, getStyles);
