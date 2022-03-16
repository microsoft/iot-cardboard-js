import {
    Callout,
    DirectionalHint,
    ICalloutProps,
    ITextFieldProps,
    TextField,
} from '@fluentui/react';
import { useGuid } from '../../Models/Hooks';
import React, { useRef, useState } from 'react';
import './AutoComplete.scss';
import CaretCoordinates from './CaretCoordinates';

export interface IAutoCompleteProps {
    className?: string;
    textFieldProps?: ITextFieldProps;
    calloutProps?: ICalloutProps;
    defaultValue?: string;
    items?: string[];
    itemContainerClassName?: string;
    itemClassName?: string;
    selectedItemClassName?: string;
    onValueChange?: (newValue: string) => void;
    getItems?: (
        value: string,
        items: string[],
        changedPosition: number,
    ) => string[];
    onSelected?: (
        value: string,
        selectedValue,
        changedPosition: number,
    ) => string;
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const AutoComplete: React.FC<IAutoCompleteProps> = ({
    className = '',
    defaultValue,
    textFieldProps,
    calloutProps,
    items,
    selectedItemClassName,
    itemContainerClassName,
    itemClassName,
    onValueChange: onChange,
    getItems,
    onSelected,
}) => {
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const [calloutVisible, setCalloutVisible] = useState(false);
    const [filteredItems, setFilteredItems] = useState(items || []);
    const [value, setValue] = useState(defaultValue || '');
    const textFieldId = 'TF' + useGuid(); // Query selector must start with a letter
    const caretRef = useRef<any>(null);
    const gapRef = useRef(0);
    const topRef = useRef(0);
    itemContainerClassName =
        itemContainerClassName || 'cb-autocomplete-container';
    itemClassName = itemClassName || 'cb-autocomplete-item';
    selectedItemClassName =
        selectedItemClassName || 'cb-autocomplete-item-selected';

    const textField = document.getElementById(textFieldId) as HTMLInputElement;

    if (textField) {
        caretRef.current = new CaretCoordinates(textField);
    }

    const itemSelected = async (index: number) => {
        if (index >= 0 && index < filteredItems.length) {
            let newValue = filteredItems[index];
            let caret = textField.selectionEnd;
            if (onSelected) {
                newValue = onSelected(value, newValue, textField.selectionEnd);
            }

            setValue(newValue);
            doFilter(newValue);
            caret += newValue.length - value.length;
            await sleep(50); // Wait for the re-render
            textField.setSelectionRange(caret, caret);
        }
        setCalloutVisible(false);
    };

    const onKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        let index = selectedItemIndex;
        switch (e.key) {
            case 'ArrowUp':
                if (calloutVisible) {
                    index--;
                    if (index < 0) {
                        index = filteredItems.length - 1;
                    }
                    e.preventDefault();
                }
                break;
            case 'ArrowDown':
                if (calloutVisible) {
                    index++;
                    if (index >= filteredItems.length) {
                        index = 0;
                    }
                    e.preventDefault();
                }
                break;
            case 'Escape':
                setCalloutVisible(false);
                break;
            case 'Enter':
                if (calloutVisible) {
                    if (selectedItemIndex >= 0) {
                        itemSelected(selectedItemIndex);
                    }
                    e.preventDefault();
                }
                break;
            case ' ':
                if (e.ctrlKey) {
                    setCalloutVisible(true);
                    e.preventDefault();
                }
                break;
            default:
                maybeShow(value, filteredItems);
        }

        if (index >= filteredItems.length) {
            index = filteredItems.length - 1;
        } else if (index < 0) {
            index = -1;
        }

        if (index !== selectedItemIndex) {
            setSelectedItemIndex(index);
        }
    };

    const defaultGetItems = (
        newValue: string,
        items: string[],
        _changedPosition: number,
    ): string[] => {
        const val = newValue.replaceAll('\n', '');
        const it = items || [];
        const filtered = val
            ? it.filter(
                  (item) => item.toLowerCase().indexOf(val.toLowerCase()) >= 0,
              )
            : [];
        return filtered;
    };

    const doFilter = (newValue: string) => {
        const gi = getItems || defaultGetItems;
        const pos = textField?.selectionEnd || 0;
        const filtered = gi(newValue, items, pos);
        setFilteredItems(filtered);
        maybeShow(newValue, filtered);
        if (onChange) {
            onChange(newValue);
        }

        const index = filtered.length ? 0 : -1;

        if (selectedItemIndex !== index) {
            setSelectedItemIndex(index);
        }
    };

    const onChanged = (newValue: string) => {
        setValue(newValue);
        doFilter(newValue);
    };

    const maybeShow = (value: string, filtered: string[]) => {
        let show = true;
        value = value.replaceAll('\n', '');
        if (
            filtered.length === 0 ||
            (filtered.length === 1 &&
                value.toLowerCase() === filtered[0].toLowerCase())
        ) {
            show = false;
        }

        if (calloutVisible !== show) {
            setCalloutVisible(show);
        }
    };

    const onBlur = () => {
        setCalloutVisible(false);
    };

    const onPointerMove = () => {
        if (selectedItemIndex !== -1) {
            setSelectedItemIndex(-1);
        }
    };

    if (textField) {
        gapRef.current =
            (caretRef.current?.get(textField.selectionEnd)?.left || 10) + 5;
        topRef.current =
            (caretRef.current?.get(textField.selectionEnd)?.top || 0) + 15;
    }

    return (
        <>
            <TextField
                className={className}
                value={value}
                onChange={(e, val) => onChanged(val)}
                spellCheck={false}
                autoComplete={'off'}
                {...textFieldProps}
                id={textFieldId}
                onKeyDown={(e) => onKeyDown(e)}
                onBlur={onBlur}
                validateOnFocusOut={true}
            />
            <Callout
                styles={{ root: { marginTop: topRef.current } }}
                hidden={!calloutVisible}
                isBeakVisible={false}
                directionalHint={DirectionalHint.leftTopEdge}
                coverTarget
                gapSpace={gapRef.current}
                {...calloutProps}
                target={`#${textFieldId}`}
            >
                <div className={itemContainerClassName}>
                    {filteredItems.map((item, index) => (
                        <div
                            key={index}
                            className={`${itemClassName} ${
                                index === selectedItemIndex
                                    ? selectedItemClassName
                                    : ''
                            }`}
                            onPointerMove={onPointerMove}
                            onPointerDown={() => itemSelected(index)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </Callout>
        </>
    );
};
