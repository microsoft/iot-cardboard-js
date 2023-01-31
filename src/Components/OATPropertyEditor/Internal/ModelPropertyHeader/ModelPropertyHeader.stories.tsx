import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import ModelPropertyHeader from './ModelPropertyHeader';
import { IModelPropertyHeaderProps } from './ModelPropertyHeader.types';
import {
    OAT_GRAPH_REFERENCE_TYPE,
    OAT_INTERFACE_TYPE
} from '../../../../Models/Constants';
import { buildModelId } from '../../../../Models/Services/OatUtils';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATPropertyEditor/ModelPropertyHeader',
    component: ModelPropertyHeader,
    decorators: [
        getDefaultStoryDecorator<IModelPropertyHeaderProps>(wrapperStyle)
    ]
};

type ModelPropertyHeaderStory = ComponentStory<typeof ModelPropertyHeader>;

const Template: ModelPropertyHeaderStory = (args) => {
    return <ModelPropertyHeader {...args} />;
};

export const InterfaceHeader = Template.bind({}) as ModelPropertyHeaderStory;
InterfaceHeader.args = {
    entityId: buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    }),
    entityName: 'Model 5',
    entityType: OAT_INTERFACE_TYPE,
    onInfoButtonClick: () => console.log('open info dialog')
} as IModelPropertyHeaderProps;

export const RelationshipHeader = Template.bind({}) as ModelPropertyHeaderStory;
RelationshipHeader.args = {
    entityId: buildModelId({
        modelName: 'model' + 5,
        namespace: 'test-namespace',
        path: 'folder1:folder2',
        version: 2
    }),
    entityName: 'Relationship 5',
    entityType: OAT_GRAPH_REFERENCE_TYPE
} as IModelPropertyHeaderProps;
