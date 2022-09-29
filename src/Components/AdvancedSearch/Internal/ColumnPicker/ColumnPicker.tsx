import React, { useEffect } from 'react';
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
    searchedProperties,
    allAvailableProperties,
    addColumn,
    deleteColumn,
    styles
}) => {
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });
    const { t } = useTranslation();
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        if (item) {
            if (item.selected) {
                setSelectedKeys((prevState) => [
                    ...prevState,
                    item.key as string
                ]);
                addColumn(item.key as string);
            } else {
                setSelectedKeys(selectedKeys.filter((key) => key !== item.key));
                deleteColumn(item.key as string);
            }
        }
    };

    useEffect(() => {
        //if the searched properties is not in selected keys then add it
        const selectedKeysSet = new Set(selectedKeys);
        searchedProperties.forEach(
            (property) =>
                !selectedKeysSet.has(property) &&
                onChange(undefined, {
                    key: property,
                    text: property,
                    selected: true
                })
        );
    }, [searchedProperties]);

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
                }
            }
        });
        return options;
    };
    return (
        <div>
            <Dropdown
                placeholder={t('advancedSearch.selectAdditionalColumns')}
                ariaLabel={t('advancedSearch.availableProperties')}
                onRenderTitle={onRenderTitle}
                options={setDropdownOptions()}
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
