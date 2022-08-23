import React, { useEffect, useState } from 'react';
import {
    IQueryBuilderRowProps,
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles
} from './QueryBuilder.types';
import { getRowStyles } from './QueryBuilder.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    Stack,
    Dropdown,
    IconButton,
    IDropdownOption,
    TextField,
    IButtonStyles,
    ComboBox,
    IComboBoxOption,
    IComboBox,
    SpinButton,
    SelectableOptionMenuItemType
} from '@fluentui/react';
import { getOperators, OperatorData } from './QueryBuilderUtils';
import { useFlattenedProperties } from './useFlattenedProperties';

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
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const [comboBoxOptions, setComboBoxOptions] = useState<IComboBoxOption[]>(
        []
    );
    const [selectedOperator, setSelectedOperator] = useState<
        IDropdownOption<OperatorData>
    >();
    const [operatorOptions, setOperatorOptions] = useState<
        IDropdownOption<OperatorData>[]
    >();
    const [selectedProperty, setSelectedProperty] = useState<IDropdownOption>();
    const [selectedCombinator, setSelectedCombinator] = useState<string>();

    const { isLoading, flattenedProperties } = useFlattenedProperties({
        adapter,
        allowedPropertyValueTypes
    });

    useEffect(() => {
        const comboBoxOptions: IComboBoxOption[] = [];
        if (flattenedProperties) {
            Object.keys(flattenedProperties).forEach((modelName: string) => {
                comboBoxOptions.push({
                    key: modelName,
                    text: modelName,
                    itemType: SelectableOptionMenuItemType.Header
                });
                flattenedProperties[modelName].forEach((property) => {
                    comboBoxOptions.push({
                        key: property.key,
                        text: property.localPath,
                        data: {
                            name: property.name,
                            type: property.propertyType
                        }
                    });
                });
            });
            setComboBoxOptions(comboBoxOptions);
        }
    }, [isLoading, flattenedProperties]);

    useEffect(() => {
        const operatorOptions = getOperators(selectedProperty?.data.type);
        setOperatorOptions(operatorOptions);
        if (operatorOptions.length) {
            setSelectedOperator(operatorOptions[0]);
        }
    }, [selectedProperty]);

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

    const onChangePropertyCombobox = (
        _event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption
    ) => {
        setSelectedProperty(option);
        onChangeProperty(rowId, option.data?.name, option.data?.type);
    };

    const onChangeValueField = (
        _event: React.SyntheticEvent<HTMLElement, Event>,
        newValue?: string
    ) => {
        onChangeValue(rowId, {
            combinator: selectedCombinator,
            operatorData: selectedOperator.data,
            property: selectedProperty.text, // MAYBE CHANGE TO DATA VALUE?
            value: newValue
        });
    };

    const onChangeDropdownValue = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<any>,
        _index?: number
    ) => {
        onChangeValue(rowId, {
            combinator: selectedCombinator,
            operatorData: selectedOperator.data,
            property: selectedProperty.text, // MAYBE CHANGE TO DATA VALUE?
            value: option.text
        });
    };

    const renderValueField = () => {
        if (!selectedProperty) {
            return (
                <TextField
                    styles={classNames.subComponentStyles.textfield}
                    disabled={true}
                />
            );
        } else if (selectedProperty.data.type === 'string') {
            return (
                <TextField
                    styles={classNames.subComponentStyles.textfield}
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
                    onChange={onChangeDropdownValue}
                    styles={classNames.subComponentStyles.textfield}
                />
            );
        } else {
            return (
                <SpinButton
                    styles={classNames.subComponentStyles.textfield}
                    onChange={onChangeValueField}
                />
            );
        }
    };

    return (
        <div className={classNames.root}>
            <Stack horizontal={true} style={{ alignItems: 'end' }}>
                <div className={classNames.lastColumn}>
                    {position !== 0 && (
                        <Dropdown
                            options={[
                                {
                                    key: 'And',
                                    text: 'And',
                                    selected: true
                                },
                                {
                                    key: 'Or',
                                    text: 'Or'
                                }
                            ]}
                            onChange={onChangeCombinator}
                            styles={classNames.subComponentStyles.andDropdown}
                        />
                    )}
                </div>
                {/* Property */}
                <div className={classNames.propertyContainer}>
                    <ComboBox
                        options={comboBoxOptions}
                        onChange={onChangePropertyCombobox}
                    />
                </div>
                {/* Operator */}
                <Dropdown
                    options={operatorOptions}
                    selectedKey={selectedOperator ? selectedOperator.key : null}
                    onChange={onChangeOperator}
                    styles={classNames.subComponentStyles.operatorDropdown}
                />
                {/* Value */}
                {renderValueField()}
                <IconButton
                    iconProps={{
                        iconName: 'trash'
                    }}
                    onClick={() => removeRow(position, rowId)}
                    disabled={isRemoveDisabled}
                    styles={
                        classNames.subComponentStyles
                            .iconButton as Partial<IButtonStyles>
                    }
                />
            </Stack>
        </div>
    );
};

export default styled<
    IQueryBuilderRowProps,
    IQueryBuilderRowStyleProps,
    IQueryBuilderRowStyles
>(QueryBuilderRow, getRowStyles);
