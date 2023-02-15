import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JSONEditor from './JSONEditor';
import { IJSONEditorProps } from './JSONEditor.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/JSONEditor',
    component: JSONEditor,
    decorators: [getDefaultStoryDecorator<IJSONEditorProps>(wrapperStyle)]
};

type JSONEditorStory = ComponentStory<typeof JSONEditor>;

const Template: JSONEditorStory = (args) => {
    return <JSONEditor {...args} />;
};

export const Base = Template.bind({}) as JSONEditorStory;
Base.args = {} as IJSONEditorProps;
