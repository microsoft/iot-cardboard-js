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
    Dropdown,
    Icon,
    SelectableOptionMenuItemType,
    Stack,
    IDropdownOption
} from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
>();

const PropertyTypePicker: React.FC<IPropertyTypePickerProps> = (props) => {
    const { onSelect, styles } = props;

    // contexts

    // state
    const options: IDropdownOption<{ iconName: string }>[] = [
        {
            text: 'Complex',
            itemType: SelectableOptionMenuItemType.Header,
            key: 'complex-header'
        },
        {
            text: 'Object',
            data: { iconName: 'SplitObject' },
            key: 'object'
        },
        { text: 'Map', data: { iconName: 'MapPin' }, key: 'map' },
        {
            text: 'Primitive',
            itemType: SelectableOptionMenuItemType.Header,
            key: 'primitive-header'
        },
        {
            text: 'DateTime',
            data: { iconName: 'DateTime' },
            key: 'datetime'
        },
        {
            text: 'Integer',
            data: { iconName: 'NumberField' },
            key: 'integer'
        },
        {
            text: 'Polygons',
            itemType: SelectableOptionMenuItemType.Header,
            key: 'polygon-header'
        },
        {
            text: 'Point',
            data: { iconName: 'AzureServiceEndpoint' },
            key: 'point'
        },
        {
            text: 'Multi-point',
            data: { iconName: '12PointStar' },
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
        <Dropdown
            dropdownWidth={'auto'}
            selectedKey={-1} // keep from selecting any entries
            onChange={(_ev, option) => onSelect(option)}
            options={options}
            onRenderCaretDown={() => null}
            onRenderPlaceholder={() => {
                return (
                    <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <Icon iconName={'Add'} /> <span>{t('add')}</span>
                    </Stack>
                );
            }}
            onRenderOption={(props, defaultRenderer) => {
                if (props.data?.iconName) {
                    return (
                        <Stack
                            horizontal
                            tokens={{ childrenGap: 8 }}
                            styles={{
                                root: {
                                    padding: 8
                                }
                            }}
                        >
                            <Icon
                                iconName={props.data.iconName}
                                aria-hidden="true"
                            />
                            <span>{props.text}</span>
                        </Stack>
                    );
                } else {
                    return defaultRenderer(props);
                }
            }}
            styles={classNames.subComponentStyles.dropdown}
        />
    );
};

export default styled<
    IPropertyTypePickerProps,
    IPropertyTypePickerStyleProps,
    IPropertyTypePickerStyles
>(PropertyTypePicker, getStyles);
