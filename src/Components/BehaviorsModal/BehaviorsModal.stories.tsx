import { ComponentStory } from '@storybook/react';
import React from 'react';
import BehaviorsModal, { IBehaviorsModalProps } from './BehaviorsModal';
import mockData from './__mockData__/BehaviorsModalMockData.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import { BehaviorModalMode } from '../../Models/Constants';
import { within, userEvent } from '@storybook/testing-library';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/Behaviors Modal',
    component: BehaviorsModal,
    decorators: [getDefaultStoryDecorator<IBehaviorsModalProps>(wrapperStyle)]
};

type BehaviorsModalStory = ComponentStory<typeof BehaviorsModal>;

const Template: BehaviorsModalStory = (args) => {
    const scenesConfig = mockData as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();

    const { sceneVisuals } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig
    );

    if (sceneVisuals.length === 0) return null;
    const { behaviors, element, twins } = sceneVisuals[1];
    return (
        <div style={wrapperStyle}>
            <BehaviorsModal
                behaviors={
                    args.mode === BehaviorModalMode.preview
                        ? [behaviors[1]]
                        : behaviors
                }
                title={element.displayName}
                twins={twins}
                adapter={new MockAdapter()}
                onDataHistoryExplorerClick={(twinId) =>
                    console.log(`Open Data History Explorer with ${twinId}`)
                }
                {...args}
            />
        </div>
    );
};

export const ViewerModeMultipleBehaviors = Template.bind(
    {}
) as BehaviorsModalStory;
ViewerModeMultipleBehaviors.args = {
    mode: BehaviorModalMode.viewer,
    onClose: () => null
};

export const ViewerModePropertyTab = Template.bind({}) as BehaviorsModalStory;
ViewerModePropertyTab.args = {
    mode: BehaviorModalMode.viewer,
    onClose: () => null
};
ViewerModePropertyTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const pivotTabs = await canvas.findAllByRole('tab');
    userEvent.click(pivotTabs[1]);
};

export const PreviewMode = Template.bind({}) as BehaviorsModalStory;
PreviewMode.args = {
    mode: BehaviorModalMode.preview
};

export const PreviewModeWithActiveWidget = Template.bind(
    {}
) as BehaviorsModalStory;
PreviewModeWithActiveWidget.args = {
    mode: BehaviorModalMode.preview,
    activeWidgetId: '740385bb6f8f235e5071ebca5ae0da89'
};
