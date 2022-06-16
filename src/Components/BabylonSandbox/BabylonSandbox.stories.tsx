import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import BabylonSandbox from './BabylonSandbox';
import { IBabylonSandboxProps } from './BabylonSandbox.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/BabylonSandbox',
    component: BabylonSandbox,
    decorators: [getDefaultStoryDecorator<IBabylonSandboxProps>(wrapperStyle)]
};

type BabylonSandboxStory = ComponentStory<typeof BabylonSandbox>;

const Template: BabylonSandboxStory = (args) => {
    return <BabylonSandbox {...args} />;
};

export const Base = Template.bind({}) as BabylonSandboxStory;
Base.args = {} as IBabylonSandboxProps;
