import React, { useState } from 'react';
import { AutoComplete, IAutoCompleteProps } from './AutoComplete';

export type GetPropertyNamesFunc = (
    twinId: string,
    meta?: { search: string; tokens: string[]; leafToken: number }
) => string[];

export interface IIntellisenseProps {
    autoCompleteProps?: IAutoCompleteProps;
    aliasNames?: string[];
    propertyNames?: string[];
    defaultValue?: string;
    getPropertyNames?: GetPropertyNamesFunc;
    onChange: (value: string) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
}

export const separators = '+*&|(^/-).><={} \n';

function tokenize(str: string): string[] {
    let s = str;
    const tokens: string[] = [];
    if (!str) return tokens;
    let n = firstSeparator(str, separators);
    while (n !== -1) {
        if (n !== 0) tokens.push(s.substring(0, n));
        tokens.push(s.substring(n, n + 1));
        s = s.substring(n + 1);
        n = firstSeparator(s, separators);
    }

    n = tokens.join('').length;
    const rest = str.substring(n);
    if (rest.length > 0) {
        tokens.push(rest);
    }

    return tokens;
}

function firstSeparator(str: string, separators: string): number {
    let n = -1;
    if (!str) {
        return -1;
    }

    separators.split('').forEach((sep) => {
        const i = str.indexOf(sep);
        if (i !== -1) {
            if (i < n || n === -1) {
                n = i;
            }
        }
    });

    return n;
}

export const Intellisense: React.FC<IIntellisenseProps> = ({
    autoCompleteProps,
    aliasNames,
    propertyNames,
    defaultValue,
    getPropertyNames,
    onChange,
    isLoading = false,
    isDisabled = false
}) => {
    const [value, setValue] = useState(defaultValue || '');

    function getSearchString(val: string, lastValue: string) {
        let caret = 0;
        for (let i = 0; i < val.length; i++) {
            caret = i;
            if (
                lastValue.length < i ||
                val.length < i ||
                lastValue.substring(i, i + 1) !== val.substring(i, i + 1)
            ) {
                break;
            }
        }

        const tokens = tokenize(val);
        let activeToken = 0;
        let temp = '';
        for (let i = 0; i < tokens.length; i++) {
            activeToken = i;
            temp += tokens[i];
            if (temp.length > caret) {
                break;
            }
        }

        if (
            val.length < lastValue.length &&
            separators.indexOf(tokens[activeToken]) >= 0 &&
            activeToken > 0
        ) {
            activeToken--;
        }

        let search = '';
        if (tokens.length > 0) {
            search = tokens[activeToken];
            if (
                separators.indexOf(search) >= 0 &&
                search !== '.' &&
                activeToken > 0
            ) {
                activeToken--;
                search = tokens[activeToken];
            }
        }

        return { search, tokens, activeToken };
    }

    const getItems = (
        value: string,
        _items: string[],
        changedPosition: number
    ) => {
        const { search, tokens, activeToken } = getSearchString(
            value,
            value.substring(0, changedPosition)
        );

        let items = aliasNames || ['PrimaryTwin'];
        let isTwin = true;
        if (
            (search === '.' && activeToken > 0) ||
            (activeToken > 0 && tokens[activeToken - 1] === '.')
        ) {
            items = propertyNames || ['Temperature', 'Pressure', 'Humidity'];
            isTwin = false;
            if (getPropertyNames) {
                let twinId = '';
                let leafToken = activeToken;
                if (search === '.') {
                    leafToken = activeToken - 1;
                    twinId = tokens[leafToken];
                } else if (activeToken > 1 && tokens[activeToken - 1] === '.') {
                    leafToken = activeToken - 2;
                    twinId = tokens[activeToken - 2];
                }
                items = getPropertyNames(twinId, {
                    leafToken,
                    search,
                    tokens
                });
            }
        }

        const val = search.replaceAll('\n', '');

        let filtered = [];
        if (isTwin && val) {
            filtered = items.filter(
                (item) =>
                    item.toLowerCase().substring(0, val.length) ===
                    val.toLowerCase()
            );
        } else if (!isTwin && val) {
            filtered = items.filter(
                (item) => item.toLowerCase().indexOf(val.toLowerCase()) >= 0
            );
            if (
                filtered.length === 1 &&
                filtered[0].toLowerCase() === val.toLowerCase()
            ) {
                filtered = [];
            }
        }

        if (search === '.') {
            filtered = items;
        }

        return filtered;
    };

    const onSelected = (
        value: string,
        newValue: string,
        changedPosition: number
    ): string => {
        const { search, tokens, activeToken } = getSearchString(
            value,
            value.substring(0, changedPosition)
        );
        let str = '';

        // Reassemble the string but replacing with the selected value
        for (let i = 0; i < tokens.length; i++) {
            if (i === activeToken) {
                if (search === '.') {
                    str += '.';
                }

                str += newValue;
            } else {
                str += tokens[i];
            }
        }

        return str;
    };

    const onChanged = (newValue: string) => {
        // setLastValue(value);
        setValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div className="bgwhite">
            <AutoComplete
                defaultValue={value}
                getItems={getItems}
                onSelected={onSelected}
                onValueChange={onChanged}
                textFieldProps={{
                    multiline: value.length > 40
                }}
                {...autoCompleteProps}
                isLoading={isLoading}
                isDisabled={isDisabled}
            />
        </div>
    );
};
