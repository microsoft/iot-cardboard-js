import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import TwinPropertyBuilder from './TwinPropertyBuilder';
import {
    IntellisenseModeProps,
    TwinPropertyBuilderProps,
    PropertySelectionModeProps
} from './TwinPropertyBuilder.types';
import { MockAdapter } from '../../Adapters';
import { config as mockConfig } from './__mockData__/MockTwinPropertyBuilderData';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { linkedTwinName } from '../../Models/Constants';

const wrapperStyle = { width: '400px', height: '600px', padding: 20 };

export default {
    title: 'Components/TwinPropertyBuilder',
    component: TwinPropertyBuilder,
    decorators: [
        getDefaultStoryDecorator<TwinPropertyBuilderProps>(wrapperStyle)
    ]
};

const { aliasedTwinMap } = ViewerConfigUtility.getTwinIdsForBehaviorInScene(
    mockConfig.configuration.behaviors[0],
    mockConfig,
    mockConfig.configuration.scenes[0].id
);

type TwinPropertyBuilderStory = ComponentStory<typeof TwinPropertyBuilder>;

const Template: TwinPropertyBuilderStory = (args) => {
    return <TwinPropertyBuilder {...args} />;
};

const intellisenseProps: IntellisenseModeProps = {
    mode: 'INTELLISENSE',
    intellisenseProps: {
        onChange: (value) => console.log(value),
        defaultValue: '',
        aliasNames: [linkedTwinName, ...Object.keys(aliasedTwinMap)],
        getPropertyNames: () => ['test1', 'test2', 'test3'],
        autoCompleteProps: {
            textFieldProps: {
                label: 'Property expression',
                multiline: false,
                placeholder: 'Enter expression (eg LinkedTwin.InFlow > 3)'
            }
        }
    }
};

const propertySelectionProps: PropertySelectionModeProps = {
    mode: 'PROPERTY_SELECTION',
    twinPropertyDropdownProps: {
        behavior: mockConfig.configuration.behaviors[0],
        onChange: (value) => console.log(value),
        config: mockConfig,
        sceneId: mockConfig.configuration.scenes[0].id,
        adapter: new MockAdapter(),
        selectedElements: mockConfig.configuration.scenes[0].elements.filter(
            ViewerConfigUtility.isTwinToObjectMappingElement
        ),
        label: 'Select property'
    }
};

export const ToggleMode = Template.bind({}) as TwinPropertyBuilderStory;

ToggleMode.args = {
    ...propertySelectionProps,
    ...intellisenseProps,
    mode: 'TOGGLE'
};

export const PropertySelectionMode = Template.bind(
    {}
) as TwinPropertyBuilderStory;

PropertySelectionMode.args = propertySelectionProps;

export const IntellisenseMode = Template.bind({}) as TwinPropertyBuilderStory;

IntellisenseMode.args = intellisenseProps;
