import { ComponentStory } from '@storybook/react';
import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import IllustrationMessage from './IllustrationMessage';
import { IllustrationMessageProps } from './IllustrationMessage.types';
import NoLayers from '../../Resources/Static/noLayers.svg';
import BlobError from '../../Resources/Static/error.svg';

const cardStyle = {
    height: '600px',
    width: 'unset'
};

export default {
    title: 'Components/IllustrationMessage',
    component: IllustrationMessage,
    decorators: [getDefaultStoryDecorator<IllustrationMessageProps>(cardStyle)]
};
/** Base template */
type TemplateStory = ComponentStory<typeof IllustrationMessage>;
const Template: TemplateStory = (args: IllustrationMessageProps) => (
    <IllustrationMessage {...args} />
);

/** Header and description text props + story */
const illustrationMessageTextOnly: IllustrationMessageProps = {
    headerText: 'No elements created yet',
    descriptionText: 'Create elements below',
    type: 'info',
    width: 'compact'
};

export const TextOnly = Template.bind({}) as TemplateStory;
TextOnly.args = illustrationMessageTextOnly;

/** Image and text props + story */
const illustrationMessageImageAndText: IllustrationMessageProps = {
    headerText: 'No elements created yet',
    descriptionText: 'Create elements below',
    type: 'info',
    width: 'compact',
    imageProps: {
        height: 100,
        src: NoLayers
    }
};

export const ImageAndText = Template.bind({}) as TemplateStory;
ImageAndText.args = illustrationMessageImageAndText;

/** Illustration message full capabilities */
const illustrationMessageFull: IllustrationMessageProps = {
    headerText: 'No elements created yet',
    descriptionText: 'This is description text that should wrap.',
    type: 'info',
    width: 'compact',
    imageProps: {
        height: 100,
        src: NoLayers
    },
    buttonProps: {
        onClick: () => alert('Button clicked'),
        text: 'Click me'
    },
    linkProps: {
        onClick: () => alert('Link clicked')
    },
    linkText: 'Learn more.'
};

export const FullComponent = Template.bind({}) as TemplateStory;
FullComponent.args = illustrationMessageFull;

/** Illustration message wide and error full capabilities */
const illustrationMessageWideError: IllustrationMessageProps = {
    headerText: 'ERROR',
    descriptionText:
        'This is an error message with a long text, this is supposed to be very long so it repeats what is being said.',
    type: 'error',
    width: 'wide',
    imageProps: {
        height: 200,
        src: BlobError
    },
    buttonProps: {
        onClick: () => alert('Button clicked'),
        text: 'Click me'
    },
    linkProps: {
        onClick: () => alert('Link clicked')
    },
    linkText: 'Fix this.'
};

export const ErrorWide = Template.bind({}) as TemplateStory;
ErrorWide.args = illustrationMessageWideError;
