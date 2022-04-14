import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SceneLayerMultiSelectBuilder from './SceneLayerMultiSelectBuilder';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/Scene layer multi-select builder',
    component: SceneLayerMultiSelectBuilder,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const Template = (args) => {
    return <SceneLayerMultiSelectBuilder {...args} />;
};

export const SceneLayerMultiSelectBuilderMock = Template.bind({});
