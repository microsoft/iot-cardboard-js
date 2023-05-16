import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import Annotation from './Annotation';
import { IAnnotationProps } from './Annotation.types';

const wrapperStyle = { width: '200px', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Diagram/Internal/Annotation',
    component: Annotation,
    decorators: [getDefaultStoryDecorator<IAnnotationProps>(wrapperStyle)]
};

type AnnotationStory = ComponentStory<typeof Annotation>;

const Template: AnnotationStory = (args) => {
    return <Annotation {...args} />;
};

export const Base = Template.bind({}) as AnnotationStory;
Base.args = {
    text: 'Mock entity',
    color: 'red',
    icon: 'SplitObject'
} as IAnnotationProps;
