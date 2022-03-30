import {
    IButtonProps,
    IButtonStyles,
    IContextualMenuItem,
    IFocusZoneProps,
    IListProps
} from '@fluentui/react';
import { CardboardIconNames } from '../../Models/Constants';

type IIconNames = string | CardboardIconNames;
type IListItemBaseProps<T> = {
    /** screen reader text to use for the list item */
    ariaLabel: string;
    /** override props for the root button */
    buttonProps?: Omit<IButtonProps, 'styles' | 'onClick' | 'onKeyPress'> & {
        customStyles?: IButtonStyles;
    };
    /** icon to render on the right side of the list item */
    iconEnd?: {
        name: IIconNames;
        onClick?: (item: T) => void;
    };
    /** icon or JSX element to render at the left side of the list item */
    iconStart?: {
        name: IIconNames | JSX.Element;
    };
    /** if provided will result in rendering the checkbox in either checked or unchecked state. If not provided, will not render a checkbox */
    isChecked?: boolean;
    /** the original item to provide back to callbacks */
    item: T;
    /** List items to show in the overflow set */
    overflowMenuItems?: IContextualMenuItem[];
    /** primary text to show */
    textPrimary: string;
    /** secondary text to show below the main text */
    textSecondary?: string;
};
// when NOT provided, click handler required
type WithOnClickMenuUndefined<T> = {
    openMenuOnClick: undefined;
    onClick: (item: T) => void;
};
// when false provided, click handler required
type WithOnClickMenuFalse<T> = {
    openMenuOnClick?: false;
    onClick: (item: T) => void;
};
// when value provided, onClick must not be defined
type WithoutOnClick = {
    openMenuOnClick: true;
    onClick?: undefined;
};
// make it so that the two properties are mutually exclusive
export type ICardboardListItem<T> = IListItemBaseProps<T> &
    (WithOnClickMenuUndefined<T> | WithOnClickMenuFalse<T> | WithoutOnClick);

export type ICardboardListItemPropsInternal<T> = {
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** index of the item in the list */
    index: number;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
} & ICardboardListItem<T>;

export interface ICardboardListProps<T> {
    /** name of the class to put on the root node */
    className?: string;
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** optional prop to set any specific focus zone props needed for special cases */
    focusZoneProps?: Omit<IFocusZoneProps, 'direction'>;
    /** Collection of items to include in the list */
    items: ICardboardListItem<T>[];
    /** optional prop to set any specific list props needed for special cases */
    listProps?: Omit<IListProps, 'key' | 'items' | 'onRenderCell'>;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}
