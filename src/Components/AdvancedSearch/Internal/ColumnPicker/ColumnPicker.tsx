import React from 'react';
import {
    IColumnPickerProps,
    IColumnPickerStyleProps,
    IColumnPickerStyles
} from './ColumnPicker.types';
import { getStyles } from './ColumnPicker.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    IDropdownProps,
    Icon,
    Dropdown,
    IDropdownOption
} from '@fluentui/react';

const getClassNames = classNamesFunction<
    IColumnPickerStyleProps,
    IColumnPickerStyles
>();

const ColumnPicker: React.FC<IColumnPickerProps> = ({
    searchedProperties,
    allAvailableProperties,
    styles
}) => {
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        if (item) {
            setSelectedKeys(
                item.selected
                    ? [...selectedKeys, item.key as string]
                    : selectedKeys.filter((key) => key !== item.key)
            );
        }
    };
    const onRenderPlaceholder = (props: IDropdownProps) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon
                    iconName={'ColumnOptions'}
                    aria-hidden="true"
                    styles={classNames.subComponentStyles.icon}
                />
                <span>{props.placeholder}</span>
            </div>
        );
    };
    const setDropdownOptions = () => {
        const options: IDropdownOption<string>[] = [];
        allAvailableProperties.forEach((property) => {
            if (
                property.localeCompare('$dtId') != 0 &&
                property.localeCompare('$etag') != 0 &&
                property.localeCompare('$metadata') != 0
            ) {
                const dropdownoptions = {
                    key: property,
                    text: property
                };
                options.push(dropdownoptions);
                if (searchedProperties.includes(property)) {
                    dropdownoptions['selected'] = true;
                    dropdownoptions['disabled'] = true;
                }
            }
        });
        return options;
    };
    return (
        <Dropdown
            placeholder={searchedProperties.length + ' properties selected'}
            // defaultSelectedKeys = {searchedProperties}
            ariaLabel="Custom dropdown example"
            onRenderPlaceholder={onRenderPlaceholder}
            options={setDropdownOptions()}
            onChange={onChange}
            multiSelect={true}
        />
    );
};

export default styled<
    IColumnPickerProps,
    IColumnPickerStyleProps,
    IColumnPickerStyles
>(ColumnPicker, getStyles);
