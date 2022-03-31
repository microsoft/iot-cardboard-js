import React from 'react';
import { CardboardList } from './CardboardList';
import { ICardboardGroupedListProps } from './CardboardGroupedList.types';

export const GroupedCardboardList = <T extends unknown>(
    props: ICardboardGroupedListProps<T>
) => {
    const { ...rest } = props;
    return (
        <>
            <CardboardList {...rest} isGrouped={true} />
        </>
    );
};
