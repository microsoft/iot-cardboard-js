import {
    IDropdownOption,
    IDropdownProps,
    IRenderFunction,
    IStyle,
    IStyleFunctionOrObject,
    ITheme
} from '@fluentui/react';
import { QuickTimeSpanKey } from '../../Models/Constants';

export interface IQuickTimesDropdownProps {
    defaultSelectedKey?: QuickTimeSpanKey;
    hasLabel?: boolean;
    label?: string;
    /**
     * Optional custom renderer for label
     */
    onRenderLabel?: IRenderFunction<IDropdownProps>;
    onChange?: (
        event: React.FormEvent<HTMLDivElement>,
        option?: IDropdownOption,
        index?: number
    ) => void;
    /**
     * Optional custom renderer for selected option displayed in input
     */
    onRenderTitle?: IRenderFunction<IDropdownOption[]>;
    /**
     * Optional custom renderer for the down caret
     */
    onRenderCaretDown?: IRenderFunction<IDropdownProps>;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IQuickTimesDropdownStyleProps,
        IQuickTimesDropdownStyles
    >;
}

export interface IQuickTimesDropdownStyleProps {
    theme: ITheme;
}
export interface IQuickTimesDropdownStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IQuickTimesDropdownSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IQuickTimesDropdownSubComponentStyles {}
