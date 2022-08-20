import React, { useCallback, useEffect, useState } from 'react';
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
    IComboBox
} from '@fluentui/react';
// import {
//     PropertyExpression,
//     PropertyValueType
// } from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { getOperators } from './QueryBuilderUtils';
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
        key,
        onChangeProperty,
        onChangeValue,
        position,
        removeRow,
        styles
    } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    // const [
    //     propertyExpression,
    //     setPropertyExpression
    // ] = useState<PropertyExpression>({
    //     expression: ''
    // });
    const [comboBoxOptions, setComboBoxOptions] = useState<IComboBoxOption[]>(
        []
    );
    const [selectedOperator, setSelectedOperator] = useState<IDropdownOption>();

    const { isLoading, flattenedProperties } = useFlattenedProperties({
        adapter,
        allowedPropertyValueTypes
    });

    useEffect(() => {
        if (flattenedProperties) {
            const comboBoxOptions: IComboBoxOption[] = flattenedProperties.map(
                (property) => {
                    return {
                        key: property.key,
                        text: property.name,
                        data: {
                            type: property.propertyType
                        }
                    };
                }
            );
            setComboBoxOptions(comboBoxOptions);
        }
    }, [isLoading, flattenedProperties]);

    const onChangeOperator = (
        _event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption<any>,
        _index?: number
    ) => {
        setSelectedOperator(option);
    };

    const onChangeCombobox = (
        _event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption
    ) => {
        onChangeProperty(option.data);
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
                            styles={classNames.subComponentStyles.andDropdown}
                        />
                    )}
                </div>
                {/* Property */}
                <div className={classNames.propertyContainer}>
                    {/* <ModelledPropertyDropdown
                        dropdownOptions={dropdownOptions}
                        onChange={onChangeDropdownSelection}
                        selectedKey={propertyExpression.expression}
                        dropdownTestId={DROPDOWN_TEST_ID}
                        isLoading={isLoading}
                    /> */}
                    <ComboBox
                        options={comboBoxOptions}
                        onChange={onChangeCombobox}
                    />
                </div>
                {/* Operator */}
                <Dropdown
                    options={getOperators('string')}
                    selectedKey={selectedOperator ? selectedOperator.key : null}
                    onChange={onChangeOperator}
                    styles={classNames.subComponentStyles.operatorDropdown}
                />
                {/* Value */}
                <TextField
                    styles={classNames.subComponentStyles.textfield}
                    onChange={onChangeValue}
                />

                <IconButton
                    iconProps={{
                        iconName: 'trash'
                    }}
                    onClick={() => removeRow(position, key)}
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
