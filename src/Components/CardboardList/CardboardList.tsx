import {
    FocusZone,
    FocusZoneDirection,
    IFocusZoneProps,
    IListProps,
    List
} from '@fluentui/react';
import React, { ReactNode } from 'react';
import { CardboardListItem, CardboardListItemProps } from './CardboardListItem';

export interface ICardboardListProps<T> {
    /** unique identifier for this list of items. Will be joined with index */
    listKey: string;
    /** optional prop to set any specific focus zone props needed for special cases */
    focusZoneProps?: Omit<IFocusZoneProps, 'direction'>;
    /** callback fired for each item in the list to generate the internal properties for the list items */
    getListItemProps: (item: T, index: number) => CardboardListItemProps<T>;
    /** Collection of items to include in the list */
    items: T[];
    /** optional prop to set any specific list props needed for special cases */
    listProps?: Omit<IListProps, 'key' | 'items' | 'onRenderCell'>;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
}

export const CardboardList = <T extends unknown>({
    focusZoneProps,
    getListItemProps,
    items,
    listKey,
    listProps,
    textToHighlight
}: ICardboardListProps<T> & { children?: ReactNode }) => {
    return (
        <>
            <FocusZone
                {...focusZoneProps}
                direction={FocusZoneDirection.vertical}
            >
                <List
                    {...listProps}
                    data-testid={`cardboard-list-${listKey}`}
                    key={listKey}
                    items={items}
                    onRenderCell={(item, index) => (
                        <CardboardListItem
                            {...getListItemProps(item, index)}
                            listKey={listKey}
                            index={index}
                            item={item}
                            textToHighlight={textToHighlight}
                        />
                    )}
                />
            </FocusZone>
        </>
    );
};
