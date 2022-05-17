import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ViewerElementsPanelRenderer from './ViewerElementsPanelRenderer';
import { IViewerElementsPanelRendererProps } from './ViewerElementsPanelRenderer.types';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/ViewerElementsPanelRenderer',
    component: ViewerElementsPanelRenderer,
    decorators: [
        getDefaultStoryDecorator<IViewerElementsPanelRendererProps>(
            wrapperStyle
        )
    ]
};

type ViewerElementsPanelRendererStory = ComponentStory<
    typeof ViewerElementsPanelRenderer
>;

const Template: ViewerElementsPanelRendererStory = (args) => {
    return <ViewerElementsPanelRenderer {...args} />;
};

export const Base = Template.bind({}) as ViewerElementsPanelRendererStory;

Base.args = { initialPanelOpen: true } as IViewerElementsPanelRendererProps;
