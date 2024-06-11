import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import { IStoryContext, sleep } from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Components/ADT3DSceneBuilder/Behaviors',
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
                        mockData: {
                            scenesConfig: context.parameters.data
                                ? deepCopy(context.parameters.data)
                                : trucksMockVConfig
                        }
                    })
                }
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                {..._args}
            />
        </div>
    );
};

export const EditTwinAliasTabListEmpty = Template.bind({});
EditTwinAliasTabListEmpty.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the behaviors tab
    const behaviorsTabButton = (await canvas.findAllByRole('tab'))[1];
    await userEvent.click(behaviorsTabButton);

    // click the behavior
    const behaviorListItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-0'
    );
    await userEvent.click(behaviorListItem);

    // Finds the tabs and clicks Twins
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const EditEditTwinAliasTabAddCallout = Template.bind({});
EditEditTwinAliasTabAddCallout.play = async (context) => {
    await EditTwinAliasTabListEmpty.play(context);
    const canvas = within(context.canvasElement);
    const addTwinAliasButton = await canvas.findByTestId(
        'twinsTab-addTwinAlias'
    );
    await userEvent.click(addTwinAliasButton);
    // let the callout animate
    await sleep(500);
};

// TODO_FIX_INTERACTION_TEST
// export const EditTwinAliasTabAdd = Template.bind({});
// EditTwinAliasTabAdd.play = async ({ canvasElement }) => {
//     await EditTwinAliasTabAddCallout.play({ canvasElement });

//     // Find the first available twin alias in the list and add it to behavior
//     const twinAliasItem1 = await findCalloutItemByTestId(
//         'cardboard-list-item-twin-alias-callout-list-0'
//     );

//     await userEvent.click(twinAliasItem1);
//     // let the callout animate
//     await sleep(500);
// };

// TODO_FIX_INTERACTION_TEST
// export const TwinAliasListItemMenu = Template.bind({});
// TwinAliasListItemMenu.play = async ({ canvasElement }) => {
//     await EditTwinAliasTabAdd.play({ canvasElement });
//     const canvas = within(canvasElement);

//     // Find overflow menu of the first twin alias just added
//     const twinAliasItem1MoreMenu = await canvas.findByTestId(
//         'context-menu-behavior-aliased-twin-list-0-moreMenu'
//     );

//     await userEvent.click(twinAliasItem1MoreMenu);
// };

// TODO_FIX_INTERACTION_TEST
// export const EditTwinAliasTabRemove = Template.bind({});
// EditTwinAliasTabRemove.play = async ({ canvasElement }) => {
//     await TwinAliasListItemMenu.play({ canvasElement });
//     await sleep(1000);

//     // Find the remove item in the overflow menu in twin alias list item
//     const removeOverflowItem = await findOverflowMenuItemByTestId(
//         'behaviorTwinAlias-removeOverflow'
//     );
//     await clickOverFlowMenuItem(removeOverflowItem);
// };
