import { ICardboardListItem, ICardboardListProps } from './CardboardList.types';

export type CardboardGroupedListItemType = 'item' | 'header';
export interface ICardboardGroupedListProps<T>
    extends Omit<ICardboardListProps<T>, 'isGrouped' | 'items'> {
    /** Collection of items to include in the list */
    items: ICardboardListItem<T>[];
}

export type ICardboardGroupedListItem<T> = ICardboardListItem<T> & {
    itemType: CardboardGroupedListItemType;
};
