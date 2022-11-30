import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import GraphLegend from './GraphLegend';
import { IGraphLegendProps } from './GraphLegend.types';
import { OatGraphContextProvider } from '../../../../Models/Context/OatGraphContext/OatGraphContext';
import { within, userEvent } from '@storybook/testing-library';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATGraphViewer/Internals/GraphLegend',
    component: GraphLegend,
    decorators: [getDefaultStoryDecorator<IGraphLegendProps>(wrapperStyle)]
};

type GraphLegendStory = ComponentStory<typeof GraphLegend>;

const Template: GraphLegendStory = (args) => {
    return (
        <OatGraphContextProvider initialState={{ showInheritances: false }}>
            {/* Would be a callout or something */}
            <div style={{ width: 175 }}>
                <GraphLegend {...args} />
            </div>
        </OatGraphContextProvider>
    );
};

export const Base = Template.bind({}) as GraphLegendStory;
Base.args = {} as IGraphLegendProps;

export const HideRelationships = Template.bind({}) as GraphLegendStory;
HideRelationships.args = {} as IGraphLegendProps;
HideRelationships.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId(
        'graph-legend-show-relationships-toggle'
    );
    userEvent.click(menu);
};

export const ShowInheritances = Template.bind({}) as GraphLegendStory;
ShowInheritances.args = {} as IGraphLegendProps;
ShowInheritances.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId(
        'graph-legend-show-inheritances-toggle'
    );
    userEvent.click(menu);
};

export const HideComponents = Template.bind({}) as GraphLegendStory;
HideComponents.args = {} as IGraphLegendProps;
HideComponents.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId(
        'graph-legend-show-components-toggle'
    );
    userEvent.click(menu);
};
