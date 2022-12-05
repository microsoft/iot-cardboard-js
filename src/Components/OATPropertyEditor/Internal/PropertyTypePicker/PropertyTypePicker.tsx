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
import { DTDLSchema } from '../../../../Models/Classes/DTDL';

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
                    return (
                        <Stack horizontal verticalAlign="center">
                            <PropertyIcon
                                schema={props.item.key as DTDLSchema}
                            />
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
