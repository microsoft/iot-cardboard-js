import { ComponentStory } from '@storybook/react';
import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { NoDataMessage, NoDataMessageProps } from './NoDataMessage';
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

const noDataMessageHeaderOnly: NoDataMessageProps = {
    headerTextTag: '3dSceneBuilder.noElementsText'
};

const noDataMessageTextOnly: NoDataMessageProps = {
    headerTextTag: '3dSceneBuilder.noElementsText',
    descriptionTextTag: '3dSceneBuilder.noElementsText'
};

const noDataMessageImageAndText: NoDataMessageProps = {
    headerTextTag: '3dSceneBuilder.noElementsText',
    descriptionTextTag: '3dSceneBuilder.noElementsText',
    imageProps: {
        height: 100,
        src: NoLayers
    }
};

type TemplateStory = ComponentStory<typeof NoDataMessage>;
const Template: TemplateStory = (args: NoDataMessageProps) => (
    <NoDataMessage {...args} />
);

export const HeaderOnly = Template.bind({}) as TemplateStory;
HeaderOnly.args = noDataMessageHeaderOnly;

export const TextOnly = Template.bind({}) as TemplateStory;
TextOnly.args = noDataMessageTextOnly;

export const ImageAndText = Template.bind({}) as TemplateStory;
ImageAndText.args = noDataMessageImageAndText;
