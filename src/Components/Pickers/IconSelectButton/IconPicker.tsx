import {
    classNamesFunction,
    IconButton,
    IStyleFunctionOrObject,
    styled,
    useTheme
} from '@fluentui/react';
import React from 'react';
import { getStyles } from './IconPicker.styles';
import {
    IIconPickerProps,
    IIconPickerStyleProps,
    IIconPickerStyles
} from './IconPicker.types';
import PickerBase from '../Internal/Picker.base';

const getClassNames = classNamesFunction<
    IIconPickerStyleProps,
    IIconPickerStyles
>();

const IconPicker: React.FC<IIconPickerProps> = (props) => {
    const { selectedItem, items, onChangeItem, styles, ...rest } = props;
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme,
        isItemSelected: false
    });
    return (
        <>
            <PickerBase
                {...rest}
                items={items}
                onChangeItem={onChangeItem}
                onRenderButton={(onClick, buttonId) => (
                    <IconButton
                        data-testid={'icon-picker-button'}
                        iconProps={{ iconName: selectedItem }}
                        id={buttonId}
                        onClick={onClick}
                        styles={classNames.subComponentStyles.button()}
                    />
                )}
                onRenderItem={(props, onClick) => {
                    const classNames = getClassNames(styles, {
                        theme: theme,
                        isItemSelected: props.item === selectedItem
                    });
                    return (
                        <IconButton
                            data-testid={'icon-picker-option'}
                            iconProps={{ iconName: props.item }}
                            onClick={(_e) => onClick(props.item)}
                            styles={classNames.subComponentStyles.button()}
                        />
                    );
                }}
                selectedItem={selectedItem}
                styles={styles}
            />
        </>
    );
};

interface ItemButtonProps {
    testId: string;
    id?: string;
    iconName: string;
    isSelected: boolean;
    onClick: (item: string) => void;
    styles: IStyleFunctionOrObject<IIconPickerStyleProps, IIconPickerStyles>;
}
const ItemButton: React.FC<ItemButtonProps> = (props) => {
    const { testId, iconName, id, isSelected, onClick, styles } = props;
    const classNames = getClassNames(styles, {
        theme: useTheme(),
        isItemSelected: isSelected
    });
    return (
        <IconButton
            data-testid={testId}
            id={id}
            iconProps={{ iconName: iconName }}
            onClick={(_e) => onClick(iconName)}
            styles={classNames.subComponentStyles.button()}
        />
    );
};

export default styled<
    IIconPickerProps,
    IIconPickerStyleProps,
    IIconPickerStyles
>(IconPicker, getStyles);
