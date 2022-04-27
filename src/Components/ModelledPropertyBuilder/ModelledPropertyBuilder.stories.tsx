import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ModelledPropertyBuilder from './ModelledPropertyBuilder';
import { ModelledPropertyBuilderProps } from './ModelledPropertyBuilder.types';
import { MockAdapter } from '../../Adapters';
import { config as mockConfig } from './__mockData__/MockPropertyModelData';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { deepCopy } from '../../Models/Services/Utils';
import { IBehavior } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const wrapperStyle = { width: '100%', height: '600px', padding: 20 };

export default {
    title: 'Components/ModelledPropertyBuilder',
    component: ModelledPropertyBuilder,
    decorators: [
        getDefaultStoryDecorator<ModelledPropertyBuilderProps>(wrapperStyle)
    ]
};

type ModelledPropertyBuilderStory = ComponentStory<
    typeof ModelledPropertyBuilder
>;

const mockBehavior = deepCopy(
    mockConfig.configuration.behaviors[0]
) as IBehavior;

const Template: ModelledPropertyBuilderStory = (args) => {
    const {
        primaryTwinIds,
        aliasedTwinMap
    } = ViewerConfigUtility.getTwinIdsForBehaviorInScene(
        mockBehavior,
        mockConfig,
        mockConfig.configuration.scenes[0].id
    );

    return (
        <ModelledPropertyBuilder
            {...args}
            adapter={new MockAdapter({})}
            primaryTwinIds={primaryTwinIds}
            aliasedTwinMap={aliasedTwinMap}
        />
    );
};

export const ToggleMode = Template.bind({}) as ModelledPropertyBuilderStory;

ToggleMode.args = {
    mode: 'TOGGLE'
};
