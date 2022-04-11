import { FocusZone, FocusZoneDirection, List } from '@fluentui/react';
import React from 'react';
import { ICardboardBasicListProps } from './CardboardBasicList.types';
import { CardboardBasicListItem } from './CardboardBasicListItem';

export const CardboardBasicList = ({
    className,
    focusZoneProps,
    items,
    listKey,
    listProps,
    textToHighlight
}: ICardboardBasicListProps) => {
    const onRenderListItem = (item: string, index: number) => (
        <CardboardBasicListItem
            item={item}
            listKey={listKey}
            index={index}
            textToHighlight={textToHighlight}
        />
    );

    return (
        <FocusZone
            {...focusZoneProps}
            className={className}
            direction={FocusZoneDirection.vertical}
        >
            <List
                {...listProps}
                data-testid={`cardboard-basic-list-${listKey}`}
                items={items}
                onRenderCell={onRenderListItem}
            />
        </FocusZone>
    );
};
