import React, { useRef } from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import Diagram from './Diagram';
import { IDiagramProps } from './Diagram.types';
import { PID_EXTRACTED_PROPERTIES } from '../../Models/Constants';
import CoffeeRoasteryPIDData from '../../Adapters/__mockData__/PID/CoffeeRoastery.json';
import WasteWaterPIDData from '../../Adapters/__mockData__/PID/WasteWater.json';
import { getColorByIdx } from '../../Services/Utils';
import { Kind } from '../../Models/Wizard.types';
import CoffeeRoasteryImg from './__mockData__/CoffeeRoastery.png';
import WasteWaterImg from './__mockData__/WasteWater.jpg';

const wrapperStyle = { width: '1200px', height: '600px', overflow: 'visible' };

export default {
    title: 'Apps/Legion/Diagram',
    component: Diagram,
    decorators: [getDefaultStoryDecorator<IDiagramProps>(wrapperStyle)]
};

type DiagramStory = ComponentStory<typeof Diagram>;

const Template: DiagramStory = (args) => {
    const containerRef = useRef(null);
    return (
        <div style={{ width: '1200px', height: '600px' }} ref={containerRef}>
            <Diagram {...args} parentRef={containerRef} />
        </div>
    );
};

const mockType = {
    icon: 'SplitObject',
    color: getColorByIdx(0),
    friendlyName: '',
    id: '',
    isDeleted: false,
    isNew: true,
    kind: Kind.PID,
    properties: []
};

export const CoffeeRoastery = Template.bind({}) as DiagramStory;
CoffeeRoastery.args = {
    parentRef: null,
    imageUrl: CoffeeRoasteryImg,
    annotations: CoffeeRoasteryPIDData.map((d) => ({
        friendlyName: d['Detected Text'],
        isNew: true,
        values: {
            [PID_EXTRACTED_PROPERTIES.X]: d.X,
            [PID_EXTRACTED_PROPERTIES.Y]: d.Y,
            [PID_EXTRACTED_PROPERTIES.Confidence]: d.Confidence
        },
        type: mockType
    }))
} as IDiagramProps;

export const WasteWater = Template.bind({}) as DiagramStory;
WasteWater.args = {
    parentRef: null,
    imageUrl: WasteWaterImg,
    annotations: WasteWaterPIDData.map((d) => ({
        friendlyName: d['Detected Text'],
        isNew: true,
        values: {
            [PID_EXTRACTED_PROPERTIES.X]: d.X,
            [PID_EXTRACTED_PROPERTIES.Y]: d.Y,
            [PID_EXTRACTED_PROPERTIES.Confidence]: d.Confidence
        },
        type: mockType
    }))
} as IDiagramProps;
