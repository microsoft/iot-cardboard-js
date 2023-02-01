import React from 'react';
import { ComponentStory } from '@storybook/react';
import EditorPropertiesTab from './EditorPropertiesTab';
import { IEditorPropertiesTabProps } from './EditorPropertiesTab.types';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { CommandHistoryContextProvider } from '../../../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { buildModelId } from '../../../../Models/Services/OatUtils';
import {
    getMockModelItem,
    getMockReference
} from '../../../../Models/Context/OatPageContext/OatPageContext.mock';
import { DTDLType } from '../../../../Models/Classes/DTDL';
import { getMockProperty } from '../../../../Models/Services/OatTestUtils';
import { DtdlComponent, DtdlRelationship } from '../../../../Models/Constants';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/EditorPropertiesTab',
    component: EditorPropertiesTab,
    decorators: [
        getDefaultStoryDecorator<IEditorPropertiesTabProps>(wrapperStyle)
    ]
};

type EditorPropertiesTabStory = ComponentStory<typeof EditorPropertiesTab>;

const Template: EditorPropertiesTabStory = (args) => {
    return (
        <OatPageContextProvider disableLocalStorage={true}>
            <CommandHistoryContextProvider>
                <EditorPropertiesTab {...args} />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Model = Template.bind({}) as EditorPropertiesTabStory;
Model.args = (() => {
    const modelId1 = buildModelId({
        modelName: 'model' + 5,
        path: 'test-namespace:folder1:folder2',
        version: 2
    });
    const model = getMockModelItem(modelId1);
    model.contents = [
        getMockProperty({
            type: 'boolean'
        }),
        getMockProperty({
            type: 'Array',
            itemSchema: 'string'
        })
    ];
    return {
        selectedItem: model,
        parentModelId: model['@id']
    } as IEditorPropertiesTabProps;
})();

export const Relationship = Template.bind({}) as EditorPropertiesTabStory;
Relationship.args = (() => {
    const reference = getMockReference(
        'referenceId-1',
        DTDLType.Relationship
    ) as DtdlRelationship;
    reference.properties = [
        getMockProperty({
            type: 'boolean'
        }),
        getMockProperty({
            type: 'Array',
            itemSchema: 'string'
        })
    ];
    return {
        selectedItem: reference,
        parentModelId: reference['@id']
    } as IEditorPropertiesTabProps;
})();

export const Component = Template.bind({}) as EditorPropertiesTabStory;
Component.args = (() => {
    const reference = getMockReference(
        'referenceId-1',
        DTDLType.Component
    ) as DtdlComponent;
    return {
        selectedItem: reference,
        parentModelId: reference['@id']
    } as IEditorPropertiesTabProps;
})();

export const NoSelection = Template.bind({}) as EditorPropertiesTabStory;
NoSelection.args = (() => {
    return {
        selectedItem: null,
        parentModelId: undefined
    } as IEditorPropertiesTabProps;
})();
