import React, { useEffect, useState } from 'react';
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
import { getDebugLogger } from '../../../../Models/Services/Utils';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ColumnPicker', debugLogging);

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
    // hooks
    const { t } = useTranslation();

    // state
    const [options, setOptions] = useState<IDropdownOption<string>[]>([]);

    // callbacks
    const onChange = (
        _event: React.FormEvent<HTMLDivElement>,
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

    const onRenderTitle = (): JSX.Element => {
        const selectedItemCount = options.filter((x) => x.selected).length;
        const placeholder = [
            {
                text: `${t('advancedSearch.propertyCount', {
                    selectedPropsCount: selectedItemCount
                })}`,
                data: { icon: 'ColumnOptions' }
            }
        ];
        logDebugConsole(
            'debug',
            'Render menu title. SelectedItems: ',
            selectedItemCount
        );
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

    // side effects
    useEffect(() => {
        const optionsList: IDropdownOption<string>[] = [];
        allAvailableProperties.forEach((property) => {
            if (
                property.localeCompare('$dtId') != 0 &&
                property.localeCompare('$etag') != 0 &&
                property.localeCompare('$metadata') != 0
            ) {
                const dropdownOption: IDropdownOption<string> = {
                    key: property,
                    text: property,
                    selected: selectedKeys.includes(property)
                };
                optionsList.push(dropdownOption);
            }
        });
        logDebugConsole(
            'debug',
            'Setting options list. {options}',
            optionsList
        );
        setOptions(optionsList);
    }, [allAvailableProperties, selectedKeys]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    logDebugConsole(
        'debug',
        'Render. {options, selectedKeys, allProperties}',
        options,
        selectedKeys,
        allAvailableProperties
    );

    return (
        <div>
            <Dropdown
                ariaLabel={t('advancedSearch.availableProperties')}
                multiSelect={true}
                onChange={onChange}
                onRenderTitle={onRenderTitle}
                options={options}
                placeholder={t('advancedSearch.selectAdditionalColumns')}
                selectedKeys={selectedKeys}
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
