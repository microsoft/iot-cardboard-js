import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ModelledPropertyBuilder from './ModelledPropertyBuilder';
import {
    IntellisenseModeProps,
    ModelledPropertyBuilderProps,
    PropertySelectionModeProps
} from './ModelledPropertyBuilder.types';
import { MockAdapter } from '../../Adapters';
import { config as mockConfig } from './__mockData__/MockPropertyModelData';
import ViewerConfigUtility from '../../Models/Classes/ViewerConfigUtility';
import { linkedTwinName } from '../../Models/Constants';

const wrapperStyle = { width: '400px', height: '600px', padding: 20 };

export default {
    title: 'Components/ModelledPropertyBuilder',
    component: ModelledPropertyBuilder,
    decorators: [
        getDefaultStoryDecorator<ModelledPropertyBuilderProps>(wrapperStyle)
    ]
};

const { aliasedTwinMap } = ViewerConfigUtility.getTwinIdsForBehaviorInScene(
    mockConfig.configuration.behaviors[0],
    mockConfig,
    mockConfig.configuration.scenes[0].id
);

type ModelledPropertyBuilderStory = ComponentStory<
    typeof ModelledPropertyBuilder
>;

const Template: ModelledPropertyBuilderStory = (args) => {
    return <ModelledPropertyBuilder {...args} />;
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

export const ToggleMode = Template.bind({}) as ModelledPropertyBuilderStory;

ToggleMode.args = {
    ...propertySelectionProps,
    ...intellisenseProps,
    mode: 'TOGGLE'
};

export const PropertySelectionMode = Template.bind(
    {}
) as ModelledPropertyBuilderStory;

PropertySelectionMode.args = propertySelectionProps;

export const IntellisenseMode = Template.bind(
    {}
) as ModelledPropertyBuilderStory;

IntellisenseMode.args = intellisenseProps;
