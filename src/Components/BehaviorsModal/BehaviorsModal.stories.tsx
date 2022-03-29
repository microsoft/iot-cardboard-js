import { ComponentStory } from '@storybook/react';
import React from 'react';
import BehaviorsModal, { IBehaviorsModalProps } from './BehaviorsModal';
import mockData from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';

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
    const pollingInterval = 5000;

    const { sceneVisuals } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig,
        pollingInterval
    );

    if (sceneVisuals.length === 0) return null;
    const { behaviors, element, twins } = sceneVisuals[1];
    return (
        <div style={wrapperStyle}>
            <BehaviorsModal
                {...args}
                behaviors={behaviors}
                title={element.displayName}
                twins={twins}
                onClose={() => null}
            />
        </div>
    );
};

export const MockBehaviorsModal = Template.bind({});
