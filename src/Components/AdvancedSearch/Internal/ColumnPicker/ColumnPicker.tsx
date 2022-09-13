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
    const [selectedPropsCount, setSelectedPropsCount] = React.useState(
        searchedProperties.length
    );

    const onChange = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        if (item) {
            if (item.selected) {
                setSelectedKeys([...selectedKeys, item.key as string]);
                setSelectedPropsCount(selectedPropsCount + 1);
                addColumn(item.key as string);
            } else {
                setSelectedKeys(selectedKeys.filter((key) => key !== item.key));
                setSelectedPropsCount(selectedPropsCount - 1);
                deleteColumn(item.key as string);
            }
        }
    };

    const onRenderTitle = (): JSX.Element => {
        const placeholder = [
            {
                key: 'Icon',
                text: `${t('advancedSearch.propertyCount', {
                    selectedPropsCount
                })}`,
                data: { icon: 'ColumnOptions' }
            }
        ];
        return (
            <div className={classNames.dropdownTitle}>
                {placeholder[0].data && placeholder[0].data.icon && (
                    <Icon
                        styles={classNames.subComponentStyles.icon}
                        iconName={placeholder[0].data.icon}
                        aria-hidden="true"
                        title={placeholder[0].data.icon}
                    />
                )}
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
                    dropdownoptions['disabled'] = true;
                }
            }
        });
        return options;
    };
    return (
        <Dropdown
            ariaLabel="Custom dropdown example"
            onRenderTitle={onRenderTitle}
            options={setDropdownOptions()}
            onChange={onChange}
            multiSelect={true}
            styles={{
                root: { paddingRight: 28, width: 200 },
                title: { alignItems: 'center' },
                dropdownItems: { width: 200 }
            }}
        />
    );
};

export default styled<
    IColumnPickerProps,
    IColumnPickerStyleProps,
    IColumnPickerStyles
>(ColumnPicker, getStyles);
