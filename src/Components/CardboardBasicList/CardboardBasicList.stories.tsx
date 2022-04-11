import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { CardboardBasicList } from './CardboardBasicList';
import { ICardboardBasicListProps } from './CardboardBasicList.types';

const componentStyle = {
    width: '200px',
    background: 'grey',
    padding: '15px'
};
export default {
    title: 'Components/CardboardBasicList',
    component: CardboardBasicList,
    decorators: [
        getDefaultStoryDecorator<ICardboardBasicListProps>(componentStyle)
    ]
};

export const BasicList = (args) => {
    return (
        <CardboardBasicList
            {...args}
            listKey="cardboard-basic-list"
            items={['ListItem-1', 'ListItem-2', 'ListItem-3']}
        />
    );
};
