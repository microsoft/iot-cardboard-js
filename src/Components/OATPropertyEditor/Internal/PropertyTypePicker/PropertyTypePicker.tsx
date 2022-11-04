import React from 'react';
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
    IContextualMenuItem,
    ContextualMenuItemType
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
>();

const PropertyTypePicker: React.FC<IPropertyTypePickerProps> = (props) => {
    const { styles } = props;

    // contexts

    // state
    const menuOptions: IContextualMenuItem[] = [
        {
            text: 'Complex',
            itemType: ContextualMenuItemType.Header,
            key: 'complex-header'
        },
        {
            text: 'Object',
            iconProps: { iconName: 'SplitObject' },
            key: 'object'
        },
        { text: 'Map', data: { iconName: 'MapPin' }, key: 'map' },
        {
            text: 'Primitive',
            itemType: ContextualMenuItemType.Header,
            key: 'primitive-header'
        },
        {
            text: 'DateTime',
            iconProps: { iconName: 'DateTime' },
            key: 'datetime'
        },
        {
            text: 'Integer',
            iconProps: { iconName: 'NumberField' },
            key: 'integer'
        },
        {
            text: 'Polygons',
            itemType: ContextualMenuItemType.Header,
            key: 'polygon-header'
        },
        {
            text: 'Point',
            iconProps: { iconName: 'AzureServiceEndpoint' },
            key: 'point'
        },
        {
            text: 'Multi-point',
            iconProps: { iconName: '12PointStar' },
            key: 'multi-point'
        }
    ];

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
                items: menuOptions
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
