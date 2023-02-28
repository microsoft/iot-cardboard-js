import React from 'react';
import { CardboardList } from './CardboardList';
import { ICardboardGroupedListProps } from './CardboardGroupedList.types';

/**
 * A list of items that have grouping enabled to support heirarchy and dividers between sections of the list
 * @param props all the items and configurations for the list
 * @returns the list control
 */
const GroupedCardboardList = <T,>(props: ICardboardGroupedListProps<T>) => {
    const { ...rest } = props;
    return (
        <>
            <CardboardList {...rest} isGrouped={true} />
        </>
    );
};
export default GroupedCardboardList;
