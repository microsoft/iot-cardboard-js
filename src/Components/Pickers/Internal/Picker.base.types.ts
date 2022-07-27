import {
    IStyle,
    IStyleFunctionOrObject,
    ITheme,
    ICalloutContentStyles
} from '@fluentui/react';

export interface IPickerBaseProps {
    /** currently selected item */
    selectedItem: string;
    /** Items to render in the callout */
    items: IPickerOption[];
    /** label text shown above the button */
    label?: string;
    /** callback triggered when an item is selected in the callout */
    onChangeItem: (item: IPickerOption) => void;
    onRenderButton: (onClick: () => void, buttonId: string) => JSX.Element;
    /** override for the rendering of the callout items */
    onRenderItem?: (
        item: IPickerOption,
        onClick: (item: string) => void
    ) => JSX.Element;

    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IPickerBaseStyleProps, IPickerBaseStyles>;
}

/** this maps directly to `IColorCellProps` from fluent except for the renamed `color` property since we are hijacking this control */
export interface IPickerOption {
    /**
     * Arbitrary unique string associated with this option
     */
    id: string;
    /**
     * Tooltip and aria label for this item
     */
    label?: string;
    /**
     * The CSS-compatible string to describe the color
     */
    item: string;
    /**
     * Index for this option
     */
    index?: number;
}

export interface IPickerBaseStyleProps {
    theme: ITheme;
}
export interface IPickerBaseStyles {
    root: IStyle;
    button: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IPickerBaseSubComponentStyles;
}

export interface IPickerBaseSubComponentStyles {
    /** Styles for the callout that hosts the ContextualMenu options. */
    callout?: Partial<ICalloutContentStyles>;
}
