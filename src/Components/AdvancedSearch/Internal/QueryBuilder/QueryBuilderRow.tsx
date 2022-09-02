import React, { useEffect, useState } from 'react';
import {
    IQueryBuilderRowProps,
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles,
    OperatorData,
    PropertyOption,
    PropertyOptionGroup
} from './QueryBuilder.types';
import { getRowStyles, reactSelectStyles } from './QueryBuilder.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Dropdown,
    IconButton,
    IDropdownOption,
    TextField,
    SpinButton,
    Callout
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import {
    DEFAULT_COMBINATOR,
    DEFAULT_OPERATOR,
    getDefaultPropertyValues,
    getOperators
} from './QueryBuilderUtils';
import { useFlattenedModelProperties } from '../../../../Models/Hooks/useFlattenedModelProperties';
import Select, { components, SelectOptionActionMeta } from 'react-select';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles
>();

const QueryBuilderRow: React.FC<IQueryBuilderRowProps> = (props) => {
    const {
        adapter,
        allowedPropertyValueTypes,
        isRemoveDisabled,
        rowId,
        onChangeProperty,
        onChangeValue,
        position,
        removeRow,
        styles,
        onUpdateSnippet
    } = props;
    const propertySelectorId = useId('cb-advanced-search-property-select');
    // Naming this as its type since theme is a prop as well
    const iTheme = useTheme();
    const classNames = getClassNames(styles, {
        theme: iTheme,
        isOnlyFirstRow: isRemoveDisabled
    });
    const { t } = useTranslation();

    /** React select values */
    const { isLoading, flattenedModelProperties } = useFlattenedModelProperties(
        {
            adapter,
            allowedPropertyValueTypes
        }
    );

    const [propertyOptions, setPropertyOptions] = useState<
        PropertyOptionGroup[]
    >([]);

    // Other
    const [selectedOperator, setSelectedOperator] = useState<
        IDropdownOption<OperatorData>
    >();
    const [operatorOptions, setOperatorOptions] = useState<
        IDropdownOption<OperatorData>[]
    >();
    const [selectedProperty, setSelectedProperty] = useState<PropertyOption>();
    const [selectedCombinator, setSelectedCombinator] = useState<string>();
    const [selectedValue, setSelectedValue] = useState<string>();

    // Effects
    // Creating react-select options
    useEffect(() => {
        const propertyComboboxOptions: PropertyOptionGroup[] = [];
        if (!isLoading && flattenedModelProperties) {
            Object.keys(flattenedModelProperties).forEach(
                (modelName: string, index: number) => {
                    propertyComboboxOptions.push({
                        label: modelName,
                        options: []
                    });
                    flattenedModelProperties[modelName].forEach((property) => {
                        propertyComboboxOptions[index].options.push({
                            value: property.key,
                            label: property.localPath,
                            data: {
                                name: property.localPath,
                                type: property.propertyType
                            }
                        });
                    });
                }
            );
            setPropertyOptions(propertyComboboxOptions);
        }
    }, [isLoading, flattenedModelProperties]);

    // Update operator options
    useEffect(() => {
        if (selectedProperty) {
            const operatorOptions = getOperators(selectedProperty.data.type);
            setOperatorOptions(operatorOptions);
            if (operatorOptions.length) {
                setSelectedOperator(operatorOptions[0]);
            }
        }
    }, [selectedProperty]);

    // Update snippet on any input change
    useEffect(() => {
        if (selectedProperty) {
            onUpdateSnippet(rowId, {
                combinator: selectedCombinator
                    ? selectedCombinator
                    : DEFAULT_COMBINATOR,
                operatorData: selectedOperator
                    ? selectedOperator.data
                    : DEFAULT_OPERATOR,
                property: selectedProperty.data.name,
                value: selectedValue
                    ? selectedValue
                    : getDefaultPropertyValues(selectedProperty.data.type)
            });
        }
    }, [
        onUpdateSnippet,
        rowId,
        selectedCombinator,
        selectedOperator,
        selectedProperty,
        selectedValue
    ]);

    const onChangeOperator = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<OperatorData>,
        _index?: number
    ) => {
        setSelectedOperator(option);
    };

    const onChangeCombinator = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption,
        _index?: number
    ) => {
        setSelectedCombinator(option.text);
    };

    const onChangePropertySelected = (
        newValue: PropertyOption,
        _actionMeta: SelectOptionActionMeta<PropertyOption>
    ) => {
        setSelectedProperty(newValue);
        onChangeProperty(rowId, newValue.data?.name, newValue.data?.type);
    };

    const onChangeValueField = (
        _event: React.SyntheticEvent<HTMLElement, Event>,
        newValue?: string
    ) => {
        setSelectedValue(newValue);
        onChangeValue(rowId, newValue);
    };

    const onChangeValueDropdown = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<any>,
        _index?: number
    ) => {
        setSelectedValue(option.text);
        onChangeValue(rowId, option.text);
    };

    const propertySelectorStyles = reactSelectStyles(iTheme, isRemoveDisabled);

    const Group = (props) => <components.Group {...props} />;

    const Placeholder = (props) => {
        return <components.Placeholder {...props} />;
    };

    const Menu = (props) => (
        <Callout
            target={`#${propertySelectorId}`}
            styles={classNames.subComponentStyles.propertyCallout}
            isBeakVisible={false}
        >
            <components.MenuList
                {...props}
                styles={propertySelectorStyles.menuList}
            />
        </Callout>
    );

    const renderValueField = () => {
        if (!selectedProperty) {
            return (
                <TextField
                    styles={classNames.subComponentStyles.valueField}
                    disabled={true}
                />
            );
        } else if (selectedProperty.data.type === 'string') {
            return (
                <TextField
                    styles={classNames.subComponentStyles.valueField}
                    onChange={onChangeValueField}
                />
            );
        } else if (selectedProperty.data.type === 'boolean') {
            return (
                <Dropdown
                    options={[
                        {
                            key: 'True',
                            text: 'True',
                            selected: true
                        },
                        {
                            key: 'False',
                            text: 'False'
                        }
                    ]}
                    onChange={onChangeValueDropdown}
                    styles={classNames.subComponentStyles.valueField}
                />
            );
        } else {
            return (
                <SpinButton
                    styles={classNames.subComponentStyles.valueField}
                    onChange={onChangeValueField}
                />
            );
        }
    };

    return (
        <div className={classNames.root}>
            {!isRemoveDisabled && (
                <div className={classNames.firstColumn}>
                    {position !== 0 && (
                        <Dropdown
                            options={[
                                {
                                    key: 'AND',
                                    text: 'AND',
                                    selected: true
                                },
                                {
                                    key: 'OR',
                                    text: 'OR'
                                }
                            ]}
                            onChange={onChangeCombinator}
                        />
                    )}
                </div>
            )}
            <div className={classNames.inputColumn}>
                {/* Property */}
                <Select<PropertyOption>
                    className={'AdvancedSearch-propertySelectInput'}
                    classNamePrefix={'AdvancedSearch-propertySelectInput'}
                    id={propertySelectorId}
                    options={propertyOptions}
                    noOptionsMessage={() =>
                        t('advancedSearch.noPropertiesFound')
                    }
                    isSearchable={true}
                    components={{
                        Group: Group,
                        Menu: Menu,
                        Placeholder: Placeholder
                    }}
                    onChange={onChangePropertySelected}
                    styles={propertySelectorStyles}
                    placeholder={t('advancedSearch.propertyFieldPlaceholder')}
                />
            </div>
            <div className={classNames.inputColumn}>
                {/* Operator */}
                <Dropdown
                    options={operatorOptions}
                    selectedKey={selectedOperator ? selectedOperator.key : null}
                    onChange={onChangeOperator}
                    disabled={!selectedProperty}
                />
            </div>
            <div className={classNames.inputColumn}>
                {/* Value */}
                {renderValueField()}
            </div>
            <div className={classNames.buttonColumn}>
                <IconButton
                    iconProps={{
                        iconName: 'trash'
                    }}
                    onClick={() => removeRow(position, rowId)}
                    disabled={isRemoveDisabled}
                    styles={classNames.subComponentStyles.deleteButton()}
                />
            </div>
        </div>
    );
};

export default styled<
    IQueryBuilderRowProps,
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles
>(QueryBuilderRow, getRowStyles);
