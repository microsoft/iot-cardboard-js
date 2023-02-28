import { FocusZone, FocusZoneDirection, List } from '@fluentui/react';
import React, { ReactNode } from 'react';
import {
    ICardboardListItemPropsInternal,
    ICardboardListProps
} from './CardboardList.types';
import { CardboardListItem } from './CardboardListItem';

export const CardboardList = <T,>({
    className,
    focusZoneProps,
    items,
    listKey,
    listProps,
    textToHighlight
}: ICardboardListProps<T> & { children?: ReactNode }) => {
    const onRenderListItem = (
        item: ICardboardListItemPropsInternal<T>,
        index: number
    ) => (
        <CardboardListItem<T>
            {...item}
            listKey={listKey}
            index={index}
            textToHighlight={textToHighlight}
        />
    );

    return (
        <>
            <FocusZone
                {...focusZoneProps}
                className={className}
                direction={FocusZoneDirection.vertical}
            >
                <List
                    {...listProps}
                    data-testid={`cardboard-list-${listKey}`}
                    items={items}
                    onRenderCell={onRenderListItem}
                />
            </FocusZone>
        </>
    );
};
