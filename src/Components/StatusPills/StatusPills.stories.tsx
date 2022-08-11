import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { StatusPills } from './StatusPills';
import { IStatusPillsProps } from './StatusPills.types';
import mockData from '../../Components/BehaviorsModal/__mockData__/BehaviorsModalMockData.json';
import { useRuntimeSceneData } from '../../Models/Hooks/useRuntimeSceneData';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../Adapters/MockAdapter';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';

const wrapperStyle = { width: '100%', padding: 20 };

export default {
    title: 'Components/StatusPills',
    component: StatusPills,
    decorators: [getDefaultStoryDecorator<IStatusPillsProps>(wrapperStyle)]
};

type StatusPillsStory = ComponentStory<typeof StatusPills>;

const Template: StatusPillsStory = (args) => {
    const scenesConfig = mockData as I3DScenesConfig;
    const sceneId = 'f7053e7537048e03be4d1e6f8f93aa8a';
    const adapter = new MockAdapter();

    const { sceneVisuals } = useRuntimeSceneData(
        adapter,
        sceneId,
        scenesConfig
    );

    if (sceneVisuals.length === 0) return null;
    const { behaviors, twins } = sceneVisuals[1];
    const statusVisuals = () =>
        behaviors[0].visuals.filter(ViewerConfigUtility.isStatusColorVisual) ||
        [];

    return (
        <StatusPills
            {...args}
            statusVisuals={statusVisuals()}
            twins={twins}
            width={'compact'}
        />
    );
};

export const StatusPillsMock = Template.bind({}) as StatusPillsStory;
