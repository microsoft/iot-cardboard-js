import {
    FocusZone,
    FocusZoneDirection,
    IFocusZoneProps,
    IListProps,
    List
} from '@fluentui/react';
import React, { ReactNode } from 'react';
import {
    CardboardListItem,
    ICardboardListItemProps
} from './CardboardListItem';

export interface ICardboardListProps<T> {
    /** unique identifier for this list of items. Will be joined with index */
    key: string;
    /** callback fired for each item in the list to generate the internal properties for the list items */
    getListItemProps: (item: T, index: number) => ICardboardListItemProps;
    /** Collection of items to include in the list */
    items: T[];
    /** triggered when list item is clicked */
    onClick: (item: T) => void;
    /** text to highlight on the primary text. mainly used for indicating search matches */
    textToHighlight?: string;
    listProps?: IListProps;
    focusZoneProps?: IFocusZoneProps;
}

export const CardboardList = <T extends unknown>({
    focusZoneProps,
    getListItemProps,
    items,
    key,
    listProps,
    onClick,
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
                    items={items}
                    onRenderCell={(item, index) => (
                        <CardboardListItem
                            {...getListItemProps(item, index)}
                            key={key}
                            index={index}
                            onClick={() => onClick(item)}
                            textToHighlight={textToHighlight}
                        />
                    )}
                />
            </FocusZone>
        </>
    );
};
