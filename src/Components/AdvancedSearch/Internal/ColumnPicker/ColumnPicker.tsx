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
    Icon,
    Dropdown,
    IDropdownOption
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IColumnPickerStyleProps,
    IColumnPickerStyles
>();

const ColumnPicker: React.FC<IColumnPickerProps> = ({
    allAvailableProperties,
    addColumn,
    deleteColumn,
    selectedKeys,
    styles
}) => {
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const { t } = useTranslation();
    const options: IDropdownOption<string>[] = [];
    allAvailableProperties.forEach((property) => {
        if (
            property.localeCompare('$dtId') != 0 &&
            property.localeCompare('$etag') != 0 &&
            property.localeCompare('$metadata') != 0
        ) {
            const dropdownoptions = {
                key: property,
                text: property,
                selected: selectedKeys.includes(property)
            };
            options.push(dropdownoptions);
            if (selectedKeys.includes(property)) {
                dropdownoptions['selected'] = true;
            }
        }
    });
    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        if (item) {
            if (item.selected) {
                addColumn(item.key as string);
            } else {
                deleteColumn(item.key as string);
            }
        }
    };
    console.log('selectedKeys' + selectedKeys);
    // console.log('searched properties', searchedProperties);
    //console.log('options', options);

    const onRenderTitle = (): JSX.Element => {
        const selectedPropsCount = selectedKeys.length;
        const placeholder = [
            {
                text: `${t('advancedSearch.propertyCount', {
                    selectedPropsCount
                })}`,
                data: { icon: 'ColumnOptions' }
            }
        ];
        return (
            <div className={classNames.dropdownTitle}>
                <Icon
                    styles={classNames.subComponentStyles.icon}
                    iconName={placeholder[0].data.icon}
                    aria-hidden="true"
                    title={placeholder[0].data.icon}
                />

                <span>{placeholder[0].text}</span>
            </div>
        );
    };
    return (
        <div>
            <Dropdown
                placeholder={t('advancedSearch.selectAdditionalColumns')}
                ariaLabel={t('advancedSearch.availableProperties')}
                onRenderTitle={onRenderTitle}
                options={options}
                onChange={onChange}
                multiSelect={true}
                styles={classNames.subComponentStyles.dropdown}
            />
        </div>
    );
};

export default styled<
    IColumnPickerProps,
    IColumnPickerStyleProps,
    IColumnPickerStyles
>(ColumnPicker, getStyles);
