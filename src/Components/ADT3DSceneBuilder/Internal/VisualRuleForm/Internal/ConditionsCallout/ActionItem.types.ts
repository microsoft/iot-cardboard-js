import {
    IDropdownStyles,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { IColorPickerStyles } from '../../../../../Pickers/ColorSelectButton/ColorPicker.types';

/** Action item types */
export type ActionItemKey = 'color' | 'iconName';

export interface IActionItemProps {
    color?: string;
    iconName?: string;
    setActionSelectedValue(key: ActionItemKey, value: string);
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IActionItemStyleProps, IActionItemStyles>;
}

export interface IActionItemStyleProps {
    theme: ITheme;
}
export interface IActionItemStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IActionItemSubComponentStyles;
}

export interface IActionItemSubComponentStyles {
    dropdown?: Partial<IDropdownStyles>;
    colorPicker?: Partial<IColorPickerStyles>;
}
