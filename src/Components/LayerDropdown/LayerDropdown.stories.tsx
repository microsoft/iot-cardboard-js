import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import LayerDropdown from './LayerDropdown';
import { LayerDropdownProps } from './LayerDropdown.types';
import { ILayer } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const wrapperStyle = { width: '100%', height: '600px' };

export default {
    title: 'Components/LayerDropdown',
    component: LayerDropdown,
    decorators: [getDefaultStoryDecorator<LayerDropdownProps>(wrapperStyle)]
};

type LayerDropdownStory = ComponentStory<typeof LayerDropdown>;

const mockLayers: ILayer[] = [
    {
        id: '8904b620aa83c649888dadc7c8fdf492',
        displayName: 'Flow',
        behaviorIDs: [
            '421cc93046fa4b589bc2ec1dd1009c90',
            'd6a2d68bc4007f3fa624eab19105e44b'
        ]
    },
    {
        id: '9624b620aa83c649888dadc7c8fdf541',
        displayName: 'Temperature',
        behaviorIDs: ['1e0aa8384c4546c7ae1ca6e6d244922e']
    },
    {
        id: '9624b620aa83c649888dadc7c8fdf542',
        displayName: 'Electricity',
        behaviorIDs: ['1e0aa8384c4546c7ae1ca6e6d2444891']
    },
    {
        id: '9624b620aa83c649888dadc7c8fdd87a',
        displayName: 'Pressure',
        behaviorIDs: ['1e0aa8384c4546c7ae1ca6e6d244x326']
    },
    {
        id: '9624b620aa83c649888dadc7c8fd0pl6',
        displayName: 'Occupancy',
        behaviorIDs: ['1e0aa8384c4546c7ae1ca6e6d2444h8a']
    }
];

const Template: LayerDropdownStory = (args) => {
    const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>([
        mockLayers[0].id
    ]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
            <LayerDropdown
                layers={mockLayers}
                selectedLayerIds={selectedLayerIds}
                setSelectedLayerIds={setSelectedLayerIds}
                {...args}
            />
        </div>
    );
};

export const LayerDropdownMock = Template.bind({}) as LayerDropdownStory;

LayerDropdownMock.args = {};
