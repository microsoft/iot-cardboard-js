import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import TreeView from './TreeView';
import { ITreeViewProps } from './TreeView.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/TreeView',
    component: TreeView,
    decorators: [getDefaultStoryDecorator<ITreeViewProps>(wrapperStyle)]
};

type TreeViewStory = ComponentStory<typeof TreeView>;

const data = [
    {
        text: 'First asset',
        children: [
            {
                text: 'Child asset 1',
                children: []
            },
            {
                text: 'Child asset 2',
                children: []
            }
        ]
    },
    {
        text: 'Second asset',
        children: [
            {
                text: 'Child asset 1',
                children: []
            }
        ]
    },
    {
        text: 'Third asset',
        children: [
            {
                text: 'Child asset 1',
                children: []
            },
            {
                text: 'Child asset 2',
                children: [
                    {
                        text: 'Grandchild asset 1',
                        children: []
                    }
                ]
            },
            {
                text: 'Child asset 3',
                children: []
            }
        ]
    }
];

const Template: TreeViewStory = (args) => {
    return <TreeView {...args} />;
};

export const Base = Template.bind({}) as TreeViewStory;
Base.args = { data } as ITreeViewProps;
