import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Services/StoryUtilities';
import Shell from './Shell';
import { IShellProps } from './Shell.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Shell',
    component: Shell,
    decorators: [getDefaultStoryDecorator<IShellProps>(wrapperStyle)]
};

type ShellStory = ComponentStory<typeof Shell>;

const Template: ShellStory = (args) => {
    return <Shell {...args} />;
};

export const Base = Template.bind({}) as ShellStory;
Base.args = {} as IShellProps;