import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PreviewLabel from './Version3PreviewLabel';
import { IVersion3PreviewLabelProps } from './Version3PreviewLabel.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/Version3PreviewLabel',
    component: PreviewLabel,
    decorators: [
        getDefaultStoryDecorator<IVersion3PreviewLabelProps>(wrapperStyle)
    ]
};

type PreviewLabelStory = ComponentStory<typeof PreviewLabel>;

const Template: PreviewLabelStory = (args) => {
    return <PreviewLabel {...args} />;
};

export const Base = Template.bind({}) as PreviewLabelStory;
Base.args = {} as IVersion3PreviewLabelProps;
