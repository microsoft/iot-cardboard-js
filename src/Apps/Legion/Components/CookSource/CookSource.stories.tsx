import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import CookSource from './CookSource';
import { ICookSourceProps } from './CookSource.types';

const wrapperStyle = { width: '400px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/CookSource',
    component: CookSource,
    decorators: [getDefaultStoryDecorator<ICookSourceProps>(wrapperStyle)]
};

type CookSourceStory = ComponentStory<typeof CookSource>;

const Template: CookSourceStory = (args) => {
    return <CookSource {...args} />;
};

export const Base = Template.bind({}) as CookSourceStory;
Base.args = {} as ICookSourceProps;
