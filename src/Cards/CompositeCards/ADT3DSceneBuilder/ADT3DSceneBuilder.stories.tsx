import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
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

export const Mock3dSceneBuildElements = Template.bind({});

export const Mock3dSceneBuildBehaviors = Template.bind({});
Mock3dSceneBuildBehaviors.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the second one
    // TODO: move to getByTestId once we can figure out how to pass the prop through fluent
    const behaviorsTabButton = canvas.getAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);
};
