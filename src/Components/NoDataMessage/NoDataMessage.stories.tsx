import { ComponentStory } from '@storybook/react';
import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import NoDataMessage from './NoDataMessage';
import { NoDataMessageProps } from './NoDataMessage.types';
import NoLayers from '../../Resources/Static/noLayers.svg';

const cardStyle = {
    height: '600px',
    width: '300px'
};

export default {
    title: 'Components/NoDataMessage',
    component: NoDataMessage,
    decorators: [getDefaultStoryDecorator<NoDataMessageProps>(cardStyle)]
};
/** Base template */
type TemplateStory = ComponentStory<typeof NoDataMessage>;
const Template: TemplateStory = (args: NoDataMessageProps) => (
    <NoDataMessage {...args} />
);

/** Header only props + story */
const noDataMessageHeaderOnly: NoDataMessageProps = {
    headerText: 'No elements created yet'
};

export const HeaderOnly = Template.bind({}) as TemplateStory;
HeaderOnly.args = noDataMessageHeaderOnly;

/** Header and description text props + story */
const noDataMessageTextOnly: NoDataMessageProps = {
    headerText: 'No elements created yet',
    descriptionText: 'Create elements below'
};

export const TextOnly = Template.bind({}) as TemplateStory;
TextOnly.args = noDataMessageTextOnly;

/** Image and text props + story */
const noDataMessageImageAndText: NoDataMessageProps = {
    headerText: 'No elements created yet',
    descriptionText: 'Create elements below',
    imageProps: {
        height: 100,
        src: NoLayers
    }
};

export const ImageAndText = Template.bind({}) as TemplateStory;
ImageAndText.args = noDataMessageImageAndText;
