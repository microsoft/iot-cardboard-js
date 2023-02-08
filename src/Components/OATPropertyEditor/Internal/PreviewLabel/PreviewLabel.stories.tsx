import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import PreviewLabel from './PreviewLabel';
import { IPreviewLabelProps } from './PreviewLabel.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/PreviewLabel',
    component: PreviewLabel,
    decorators: [getDefaultStoryDecorator<IPreviewLabelProps>(wrapperStyle)]
};

type PreviewLabelStory = ComponentStory<typeof PreviewLabel>;

const Template: PreviewLabelStory = (args) => {
    return <PreviewLabel {...args} />;
};

export const Base = Template.bind({}) as PreviewLabelStory;
Base.args = {} as IPreviewLabelProps;
