import React, { useCallback, useState } from 'react';
import {
    ICardboardMultiSelectProps,
    ICardboardMultiSelectStyleProps,
    ICardboardMultiSelectStyles,
    MultiselectOption
} from './CardboardMultiSelect.types';
import { getMultiSelectStyles, getStyles } from './CardboardMultiSelect.styles';
import { classNamesFunction, useTheme, styled } from '@fluentui/react';
import CreatableSelect from 'react-select/creatable';
import { OnChangeValue } from 'react-select';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    ICardboardMultiSelectStyleProps,
    ICardboardMultiSelectStyles
>();

const components = {
    DropdownIndicator: null
};

const createOption = (label: string): MultiselectOption => ({
    label,
    value: label
});

const ROOT_LOC = 'cardboardMultiSelect';
const LOC_KEYS = {
    placeholderMultiselect: `${ROOT_LOC}.placeholderMultiselect`
};

const CardboardMultiSelect: React.FC<ICardboardMultiSelectProps> = (props) => {
    const { currentValues, onChangeValues, styles } = props;

    // contexts

    // state
    const [inputValue, setInputValue] = useState('');
    const [selectedValues, setSelectedValues] = useState<MultiselectOption[]>(
        currentValues
            ? (currentValues as string[]).map((value) => createOption(value))
            : []
    );

    // hooks
    const { t } = useTranslation();

    // callbacks
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (!inputValue) return;
            switch (event.key) {
                case 'Enter': {
                    const newValues = [
                        ...selectedValues,
                        createOption(inputValue)
                    ];
                    setSelectedValues((values) => {
                        return [...values, createOption(inputValue)];
                    });
                    setInputValue('');
                    onChangeValues(
                        'string',
                        newValues.map((value) => value.value)
                    );
                    break;
                }
            }
        },
        [inputValue, onChangeValues, selectedValues]
    );

    const handleInputChange = useCallback((newValue: string) => {
        setInputValue(newValue);
    }, []);

    const handleChange = useCallback(
        (value: OnChangeValue<MultiselectOption, true>) => {
            setSelectedValues([...value]);
        },
        []
    );

    // styles
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });

    const reactSelectStyles = getMultiSelectStyles(theme);

    return (
        <div className={classNames.root}>
            <CreatableSelect
                components={components}
                inputValue={inputValue}
                isClearable={true}
                isMulti={true}
                menuIsOpen={false}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={t(LOC_KEYS.placeholderMultiselect)}
                value={selectedValues}
                styles={reactSelectStyles}
            />
        </div>
    );
};

export default styled<
    ICardboardMultiSelectProps,
    ICardboardMultiSelectStyleProps,
    ICardboardMultiSelectStyles
>(CardboardMultiSelect, getStyles);
