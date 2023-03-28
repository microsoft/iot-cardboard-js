import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CustomContextMenu from './CustomContextMenu';
import { ICustomContextMenuProps } from './CustomContextMenu.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/CustomContextMenu',
    component: CustomContextMenu,
    decorators: [
        getDefaultStoryDecorator<ICustomContextMenuProps>(wrapperStyle)
    ]
};

type CustomContextMenuStory = ComponentStory<typeof CustomContextMenu>;

const Template: CustomContextMenuStory = (args) => {
    return <CustomContextMenu {...args} />;
};

export const Base = Template.bind({}) as CustomContextMenuStory;
Base.args = {} as ICustomContextMenuProps;
