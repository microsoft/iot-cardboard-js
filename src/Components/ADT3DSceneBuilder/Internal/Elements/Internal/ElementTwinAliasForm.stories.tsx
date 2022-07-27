import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { MockAdapter } from '../../../../../Adapters';
import trucksMockVConfig from '../../../../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { IStoryContext } from '../../../../../Models/Services/StoryUtilities';
import { deepCopy } from '../../../../../Models/Services/Utils';
import ADT3DSceneBuilder from '../../../ADT3DSceneBuilder';
import { IADT3DSceneBuilderCardProps } from '../../../ADT3DSceneBuilder.types';

export default {
    title: 'Components/ADT3DSceneBuilder/TwinAliases',
    component: ADT3DSceneBuilder
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

type SceneBuilderStory = ComponentStory<typeof ADT3DSceneBuilder>;
const Template: SceneBuilderStory = (
    _args,
    context: IStoryContext<IADT3DSceneBuilderCardProps>
) => {
    return (
        <div style={cardStyle}>
            <ADT3DSceneBuilder
                title={'3D Scene Builder'}
                theme={context.globals.theme}
                locale={context.globals.locale}
                adapter={
                    new MockAdapter({
                        mockData: context.parameters.data
                            ? deepCopy(context.parameters.data)
                            : trucksMockVConfig
                    })
                }
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                {..._args}
            />
        </div>
    );
};

export const ElementsBase = Template.bind({});
ElementsBase.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const tabButton = await canvas.findAllByRole('tab');
    userEvent.click(tabButton[0]);

    // click the behavior
    const button = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-2'
    );
    userEvent.click(button);

    // Finds the tabs and clicks Twins
    const tab = await canvas.findAllByRole('tab');
    userEvent.click(tab[2]);

    // click the twin
    const createTwinCallout = await canvas.findByTestId(
        'cardboard-list-item-element-aliased-twin-list-0'
    );
    userEvent.click(createTwinCallout);
};
