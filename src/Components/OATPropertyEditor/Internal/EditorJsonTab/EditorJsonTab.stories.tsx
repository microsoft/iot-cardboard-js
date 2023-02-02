import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import EditorJsonTab from './EditorJsonTab';
import { IEditorJsonTabProps } from './EditorJsonTab.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { getMockModelItem } from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { Theme } from '../../../../Models/Constants';
import { buildModelId } from '../../../../Models/Services/OatUtils';
import { CommandHistoryContextProvider } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/EditorJsonTab',
    component: EditorJsonTab,
    decorators: [getDefaultStoryDecorator<IEditorJsonTabProps>(wrapperStyle)]
};

type EditorJsonTabStory = ComponentStory<typeof EditorJsonTab>;

const Template: EditorJsonTabStory = (args) => {
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            <CommandHistoryContextProvider>
                <EditorJsonTab {...args} />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({}) as EditorJsonTabStory;
Base.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        path: 'test-namespace:folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId1);
    return {
        selectedItem: model,
        selectedThemeName: Theme.Explorer
    } as IEditorJsonTabProps;
})();
