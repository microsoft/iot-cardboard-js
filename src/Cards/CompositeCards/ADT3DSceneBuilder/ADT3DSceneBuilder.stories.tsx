import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within, screen } from '@storybook/testing-library';
import MockAdapter from '../../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import mockVConfig from '../../../Adapters/__mockData__/vconfigDecFinal.json';
import { waitForFirstRender } from '../../../Utilities';

export default {
    title: 'CompositeCards/ADT3DSceneBuilder'
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

const Template: ComponentStory<typeof ADT3DSceneBuilder> = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={cardStyle}>
        <ADT3DSceneBuilder
            title={'3D Scene Builder'}
            theme={theme}
            locale={locale}
            adapter={new MockAdapter({ mockData: mockVConfig })}
            sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
            {..._args}
        />
    </div>
);

export const SceneBuilderElementsTab = Template.bind({});
SceneBuilderElementsTab.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the second one
    // TODO: move to getByTestId once we can figure out how to pass the prop through fluent
    const behaviorsTabButton = canvas.getAllByRole('tab');
    await userEvent.click(behaviorsTabButton[0]);
};

export const SceneBuilderElementsSearch = Template.bind({});
SceneBuilderElementsSearch.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await SceneBuilderElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const searchBox = canvas.getByPlaceholderText('Search elements');
    await userEvent.type(searchBox, 'box');
};

export const SceneBuilderBehaviorsTab = Template.bind({});
SceneBuilderBehaviorsTab.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the second one
    // TODO: move to getByTestId once we can figure out how to pass the prop through fluent
    const behaviorsTabButton = canvas.getAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);
};

export const SceneBuilderBehaviorsSearch = Template.bind({});
SceneBuilderBehaviorsSearch.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await SceneBuilderBehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const searchBox = canvas.getByPlaceholderText('Search behaviors');
    await userEvent.type(searchBox, 'wheels');
};
