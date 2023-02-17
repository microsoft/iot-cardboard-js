import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import JSONEditor from './JSONEditor';
import { IJSONEditorProps } from './JSONEditor.types';
import { OatPageContextProvider } from '../../../../../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import {
    getMockFile,
    getMockModelItem
} from '../../../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { buildModelId } from '../../../../../../Models/Services/OatUtils';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/EditorJsonTab/JSONEditor',
    component: JSONEditor,
    decorators: [getDefaultStoryDecorator<IJSONEditorProps>(wrapperStyle)]
};

type JSONEditorStory = ComponentStory<typeof JSONEditor>;

const Template: JSONEditorStory = (args) => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        path: 'test-namespace:folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId1);
    const file = getMockFile(0, 'id1', 'id2');
    file.data.models = [model];
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                selection: { modelId: model['@id'] },
                currentOntologyId: 'something',
                ontologyFiles: [file]
            }}
        >
            <CommandHistoryContextProvider>
                <JSONEditor {...args} />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as JSONEditorStory;
Base.args = {} as IJSONEditorProps;
