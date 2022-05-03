import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ModelledPropertyBuilder from './ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderProps,
    PropertyExpression
} from './ModelledPropertyBuilder.types';
import { MockAdapter } from '../../Adapters';
import { config as mockConfig } from './__mockData__/MockPropertyModelData';

const wrapperStyle = { width: '400px', height: '600px', padding: 20 };

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

const Template: ModelledPropertyBuilderStory = (args) => {
    const [
        propertyExpression,
        setPropertyExpression
    ] = useState<PropertyExpression>(
        args.propertyExpression ?? { expression: '' }
    );
    return (
        <ModelledPropertyBuilder
            {...args}
            adapter={new MockAdapter()}
            config={mockConfig}
            behavior={mockConfig.configuration.behaviors[0]}
            sceneId={mockConfig.configuration.scenes[0].id}
            onChange={(newPropertyExpression: PropertyExpression) =>
                setPropertyExpression(newPropertyExpression)
            }
            propertyExpression={propertyExpression}
        />
    );
};

export const ToggleMode = Template.bind({}) as ModelledPropertyBuilderStory;

ToggleMode.args = {
    mode: 'TOGGLE',
    propertyExpression: { expression: 'LinkedTwin.CarName' }
};

export const PropertySelectionMode = Template.bind(
    {}
) as ModelledPropertyBuilderStory;

PropertySelectionMode.args = {
    mode: 'PROPERTY_SELECTION'
};

export const IntellisenseMode = Template.bind(
    {}
) as ModelledPropertyBuilderStory;

IntellisenseMode.args = {
    mode: 'INTELLISENSE'
};
