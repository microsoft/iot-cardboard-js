import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within, screen } from '@storybook/testing-library';
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

export const BehaviorsBase = Template.bind({});
BehaviorsBase.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    userEvent.click(behaviorsTabButton[1]);

    // click the behavior
    const button = await canvas.findByTestId('behavior-list-new-button');
    userEvent.click(button);

    // click some elements so you have aliases to resolve
    const listItem1 = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-0'
    );
    userEvent.click(listItem1);
    const listItem2 = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-1'
    );
    userEvent.click(listItem2);

    // Finds the tabs and clicks Twins
    const tab = await canvas.findAllByRole('tab');
    userEvent.click(tab[1]);

    // click the behavior
    const createTwinCallout = await canvas.findByTestId(
        'twinsTab-addTwinAlias'
    );
    userEvent.click(createTwinCallout);

    // click the behavior
    const createTwinButton = await screen.findByTestId(
        'create-twin-callout-button'
    );
    createTwinButton.click();
};
