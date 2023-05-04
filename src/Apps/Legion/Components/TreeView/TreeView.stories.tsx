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

const sampleData = [
    {
        name: 'First asset',
        childAssets: [
            {
                name: 'Child asset 1',
                childAssets: []
            },
            {
                name: 'Child asset 2',
                childAssets: []
            }
        ]
    },
    {
        name: 'Second asset',
        childAssets: [
            {
                name: 'Child asset 1',
                childAssets: []
            }
        ]
    },
    {
        name: 'Third asset',
        childAssets: [
            {
                name: 'Child asset 1',
                childAssets: []
            },
            {
                name: 'Child asset 2',
                childAssets: []
            },
            {
                name: 'Child asset 3',
                childAssets: []
            }
        ]
    }
];

const Template: TreeViewStory = (args) => {
    return <TreeView {...args} />;
};

export const Base = Template.bind({}) as TreeViewStory;
Base.args = { sampleData } as ITreeViewProps;
