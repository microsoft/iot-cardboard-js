import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import JSONEditor from './JSONEditor';
import { IJSONEditorProps } from './JSONEditor.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/EditorJsonTab/JSONEditor',
    component: JSONEditor,
    decorators: [getDefaultStoryDecorator<IJSONEditorProps>(wrapperStyle)]
};

type JSONEditorStory = ComponentStory<typeof JSONEditor>;

const Template: JSONEditorStory = (args) => {
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            <CommandHistoryContextProvider>
                <JSONEditor {...args} />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as JSONEditorStory;
Base.args = {} as IJSONEditorProps;
