import { IconButton, styled } from '@fluentui/react';
import React from 'react';
import { getStyles } from './IconPicker.styles';
import {
    IIconPickerProps,
    IIconPickerStyleProps,
    IIconPickerStyles
} from './IconPicker.types';
import PickerBase from '../Internal/Picker.base';

const IconPicker: React.FC<IIconPickerProps> = (props) => {
    const { selectedItem, items, onChangeItem, styles, ...rest } = props;
    return (
        <>
            <PickerBase
                {...rest}
                items={items}
                onChangeItem={onChangeItem}
                onRenderButton={(onClick, buttonId) => (
                    <IconButton
                        iconProps={{ iconName: selectedItem }}
                        onClick={onClick}
                        id={buttonId}
                    />
                )}
                onRenderItem={(props) => {
                    return (
                        <IconButton
                            iconProps={{ iconName: props.item }}
                            onClick={(_e) =>
                                onChangeItem(
                                    items.find((x) => x.item === props.item)
                                )
                            }
                        />
                    );
                }}
                selectedItem={selectedItem}
                styles={styles}
            />
        </>
    );
};

export default styled<
    IIconPickerProps,
    IIconPickerStyleProps,
    IIconPickerStyles
>(IconPicker, getStyles);
