import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import SceneLayers from './SceneLayers';

const wrapperStyle = {
    width: '800px',
    height: '600px',
    padding: '20px 0 0 20px'
};

export default {
    title: 'Components/Scene layers',
    component: SceneLayers,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const Template = (args) => {
    return <SceneLayers {...args} isInitiallyOpen={true} />;
};

export const sceneLayers = Template.bind({});
