import { ComponentStory } from '@storybook/react';
import React from 'react';
import BehaviorsModal, { IBehaviorsModalProps } from './BehaviorsModal';
import mockData from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { DatasourceType } from '../../Models/Classes/3DVConfig';
import { mockTwins } from '../../Adapters/MockAdapter';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/Behaviors Modal',
    component: BehaviorsModal,
    decorators: [getDefaultStoryDecorator<IBehaviorsModalProps>(wrapperStyle)]
};

type BehaviorsModalStory = ComponentStory<typeof BehaviorsModal>;

const mockElement: ITwinToObjectMapping = mockData.configuration.scenes[0]
    .elements[0] as ITwinToObjectMapping;
const mockBehaviors = mockData.configuration.behaviors.filter((behavior) =>
    behavior.datasources
        .find(
            (ds) =>
                ds.type === DatasourceType.ElementTwinToObjectMappingDataSource
        )
        ?.elementIDs?.includes(mockElement.id)
) as IBehavior[];

const Template: BehaviorsModalStory = (args) => {
    return (
        <div style={wrapperStyle}>
            <BehaviorsModal
                {...args}
                behaviors={mockBehaviors}
                element={mockElement}
                twins={{
                    [mockElement.linkedTwinID]: mockTwins.find(
                        (twin) => twin.$dtId === mockElement.linkedTwinID
                    )
                }}
            />
        </div>
    );
};

export const MockBehaviorsModal = Template.bind({});
