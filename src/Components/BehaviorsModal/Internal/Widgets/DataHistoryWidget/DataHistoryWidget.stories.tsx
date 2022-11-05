import React from 'react';
import { ComponentStory } from '@storybook/react';
import BehaviorsModal, { IBehaviorsModalProps } from '../../../BehaviorsModal';
import mockData from '../../../__mockData__/BehaviorsModalMockData.json';
import { I3DScenesConfig } from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import MockAdapter from '../../../../../Adapters/MockAdapter';
import { getDefaultStoryDecorator } from '../../../../../Models/Services/StoryUtilities';
import { useRuntimeSceneData } from '../../../../../Models/Hooks/useRuntimeSceneData';
import {
    BehaviorModalMode,
    ComponentErrorType
} from '../../../../../Models/Constants';

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
    const { behaviors, element, twins } = sceneVisuals[0];
    return (
        <div style={wrapperStyle}>
            <BehaviorsModal
                behaviors={
                    args.mode === BehaviorModalMode.preview
                        ? [behaviors[0]]
                        : behaviors
                }
                title={element.displayName}
                twins={twins}
                adapter={new MockAdapter()}
                {...args}
            />
        </div>
    );
};

export const DataHistoryWidgetInPreviewMode = Template.bind(
    {}
) as BehaviorsModalStory;
DataHistoryWidgetInPreviewMode.args = {
    mode: BehaviorModalMode.preview,
    activeWidgetId: 'b2cf0aa2415f4e029f27f957fb559db2'
};

export const DataHistoryWidgetInViewMode = Template.bind(
    {}
) as BehaviorsModalStory;
DataHistoryWidgetInViewMode.args = {
    mode: BehaviorModalMode.viewer
};

export const DataHistoryWidgetWithConnectionError = Template.bind(
    {}
) as BehaviorsModalStory;
DataHistoryWidgetWithConnectionError.args = {
    mode: BehaviorModalMode.viewer,
    adapter: new MockAdapter({ mockError: ComponentErrorType.ConnectionError })
};

export const DataHistoryWidgetWithBadRequestExceptionError = Template.bind(
    {}
) as BehaviorsModalStory;
DataHistoryWidgetWithBadRequestExceptionError.args = {
    mode: BehaviorModalMode.viewer,
    adapter: new MockAdapter({
        mockError: ComponentErrorType.BadRequestException
    })
};

export const DataHistoryWidgetWithUnauthorizedAccessError = Template.bind(
    {}
) as BehaviorsModalStory;
DataHistoryWidgetWithUnauthorizedAccessError.args = {
    mode: BehaviorModalMode.viewer,
    adapter: new MockAdapter({
        mockError: ComponentErrorType.UnauthorizedAccess
    })
};
