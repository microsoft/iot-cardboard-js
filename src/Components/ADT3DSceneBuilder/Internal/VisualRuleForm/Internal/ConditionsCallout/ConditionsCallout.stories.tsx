import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import ConditionsCallout from './ConditionsCallout';
import { IConditionsCalloutProps } from './ConditionsCallout.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/ConditionsCallout',
    component: ConditionsCallout,
    decorators: [
        getDefaultStoryDecorator<IConditionsCalloutProps>(wrapperStyle)
    ]
};

type ConditionsCalloutStory = ComponentStory<typeof ConditionsCallout>;

const Template: ConditionsCalloutStory = (args) => {
    return <ConditionsCallout {...args} />;
};

export const Base = Template.bind({}) as ConditionsCalloutStory;
Base.args = {} as IConditionsCalloutProps;
