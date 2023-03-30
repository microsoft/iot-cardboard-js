import React from 'react';
import { ComponentStory } from '@storybook/react';
import Graphin from '@antv/graphin';
import { getDefaultStoryDecorator } from '../../../../../../Models/Services/StoryUtilities';
import CustomLegend from './CustomLegend';
import { ICustomLegendProps } from './CustomLegend.types';
import { ICustomGraphData } from '../../GraphTypes.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components/Apps/Legion/GraphVisualizer/CustomLegend',
    component: CustomLegend,
    decorators: [getDefaultStoryDecorator<ICustomLegendProps>(wrapperStyle)]
};

type CustomLegendStory = ComponentStory<typeof CustomLegend>;

const Template: CustomLegendStory = (args) => {
    const data: ICustomGraphData<any> = {
        nodes: [
            {
                id: 'model1',
                label: 'Model 1',
                data: {
                    name: 'Test Node 1',
                    id: 'dtmi:com:example:folder2:TestNode;1',
                    itemType: 'Node',
                    relatedNodesKey: ''
                }
            },
            {
                id: 'model2',
                label: 'Model 2',
                data: {
                    name: 'Test Node 2',
                    id: 'dtmi:com:example:folder2:TestNode;1',
                    itemType: 'Node',
                    relatedNodesKey: ''
                }
            },
            {
                id: 'model3',
                label: 'Model 3',
                data: {
                    name: 'Test Node 2',
                    id: 'dtmi:com:example:folder2:TestNode;1',
                    itemType: 'Node',
                    relatedNodesKey: ''
                }
            },
            {
                id: 'model4',
                label: 'Model 4',
                data: {
                    name: 'Test Node 2',
                    id: 'dtmi:com:example:folder2:TestNode;1',
                    itemType: 'Node',
                    relatedNodesKey: ''
                }
            }
        ],
        edges: [
            {
                source: 'model1',
                target: 'model2',
                data: {
                    itemType: 'Edge',
                    name: 'Test Edge',
                    source: 'model1',
                    target: 'model2'
                }
            },
            {
                source: 'model1',
                target: 'model3',
                data: {
                    itemType: 'Edge',
                    name: 'Test Edge',
                    source: 'model1',
                    target: 'model2'
                }
            },
            {
                source: 'model1',
                target: 'model4',
                data: {
                    itemType: 'Edge',
                    name: 'Test Edge',
                    source: 'model1',
                    target: 'model2'
                }
            },
            {
                source: 'model2',
                target: 'model3',
                data: {
                    itemType: 'Edge',
                    name: 'Test Edge',
                    source: 'model1',
                    target: 'model2'
                }
            }
        ]
    };
    return (
        <Graphin data={data} layout={{ type: 'radial' }}>
            <CustomLegend {...args} />
        </Graphin>
    );
};

export const Base = Template.bind({}) as CustomLegendStory;
Base.args = {} as ICustomLegendProps;
