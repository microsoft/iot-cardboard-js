import {
    IButtonProps,
    IButtonStyles,
    IContextualMenuItem,
    IFocusZoneProps,
    IListProps
} from '@fluentui/react';
import { CardboardIconNames } from '../../Models/Constants';
import { CardboardGroupedListItemType } from './CardboardGroupedList.types';

type IIconNames = string | CardboardIconNames;
type IListItemBaseProps<T> = {
    /** screen reader text to use for the list item */
    ariaLabel: string;
    /**
     * override props for the root button.
     * Hiding mouseOver to prevent perf regressions again. Use MouseEnter instead.
     */
    buttonProps?: Omit<
        IButtonProps,
        | 'styles'
        | 'onClick'
        | 'onKeyPress'
        | 'onMouseOver'
        | 'onMouseOverCapture'
    > & {
        customStyles?: IButtonStyles;
    };
    /** icon to render on the right side of the list item */
    iconEnd?:
        | {
              name: IIconNames;
              onClick?: (item: T) => void;
          }
        | ((item: T) => React.ReactElement);
    /** icon or JSX element to render at the left side of the list item */
    iconStart?:
        | {
              name: IIconNames;
          }
        | ((item: T) => React.ReactElement);
    /** if provided false will result in rendering the red dot at the very left of the element. If not provided, will assume it is valid and not render any dot */
    isValid?: boolean;
    /** if provided will result in rendering the checkbox in either checked or unchecked state. If not provided, will not render a checkbox */
    isChecked?: boolean;
    /** the original item to provide back to callbacks */
    item: T;
    /** type of item when rendering a grouped list. Headers have dividers and items have indentation */
    itemType?: CardboardGroupedListItemType;
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
    /** whether to expect header and normal items in the collect of items */
    isGrouped?: boolean;
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
