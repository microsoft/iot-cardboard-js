import { IFocusZoneProps, IListProps } from '@fluentui/react';

export type ICardboardBasicListItemProps = {
    /** text to show in basic flat list */
    item: string;
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** index of the item in the list */
    index: number;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
};

export interface ICardboardBasicListProps {
    /** name of the class to put on the root node */
    className?: string;
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** optional prop to set any specific list props needed for special cases */
    listProps?: Omit<IListProps, 'key' | 'items' | 'onRenderCell'>;
    /** optional prop to set any specific focus zone props needed for special cases */
    focusZoneProps?: Omit<IFocusZoneProps, 'direction'>;
    /** Collection of string to include in the basic list */
    items: string[];
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}
