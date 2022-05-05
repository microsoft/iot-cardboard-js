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

const showDebug = true;

const PropertyExpressionDebugRenderer: React.FC<{
    propertyExpression: PropertyExpression;
}> = ({ propertyExpression }) => {
    return (
        <div
            style={{
                border: '1px dashed white',
                padding: 8,
                marginTop: 20
            }}
        >
            <h3 style={{ marginTop: 0 }}>Expression</h3>
            <div>{propertyExpression.expression}</div>
            {propertyExpression.property && (
                <div>
                    <h3>Property</h3>
                    <div>Full path: {propertyExpression.property.fullPath}</div>
                    <div>Name: {propertyExpression.property.name}</div>
                    <div>
                        Property type:{' '}
                        {propertyExpression.property.propertyType}
                    </div>
                </div>
            )}
        </div>
    );
};

const Template: ModelledPropertyBuilderStory = (args) => {
    const [
        propertyExpression,
        setPropertyExpression
    ] = useState<PropertyExpression>(
        args.propertyExpression ?? { expression: '' }
    );
    return (
        <div>
            <ModelledPropertyBuilder
                {...args}
                adapter={new MockAdapter()}
                twinIdParams={{
                    behavior: mockConfig.configuration.behaviors[0],
                    config: mockConfig,
                    sceneId: mockConfig.configuration.scenes[0].id
                }}
                config={mockConfig}
                behavior={mockConfig.configuration.behaviors[0]}
                sceneId={mockConfig.configuration.scenes[0].id}
                onChange={(newPropertyExpression: PropertyExpression) =>
                    setPropertyExpression(newPropertyExpression)
                }
                propertyExpression={propertyExpression}
                required
            />

            {showDebug && (
                <PropertyExpressionDebugRenderer
                    propertyExpression={propertyExpression}
                />
            )}
        </div>
    );
};

export const ToggleMode = Template.bind({}) as ModelledPropertyBuilderStory;

ToggleMode.args = {
    mode: 'TOGGLE'
};

export const ToggleModeInitialValue = Template.bind(
    {}
) as ModelledPropertyBuilderStory;

ToggleModeInitialValue.args = {
    mode: 'TOGGLE',
    propertyExpression: { expression: 'LinkedTwin.Mileage - 1000' }
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
