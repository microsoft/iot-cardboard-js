import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import {
    findCalloutItemByTestId,
    IStoryContext,
    sleep
} from '../../Models/Services/StoryUtilities';
import {
    I3DScenesConfig,
    IElement
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Components/ADT3DSceneBuilder/Elements',
    parameters: {
        // delay for the menus showing up
        chromatic: { delay: 2000 }
    }
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

type SceneBuilderStory = ComponentStory<typeof ADT3DSceneBuilder>;
const Template: SceneBuilderStory = (
    _args,
    context: IStoryContext<IADT3DSceneBuilderCardProps>
) => (
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

export const ElementsTab = Template.bind({});
ElementsTab.play = async ({ canvasElement }) => {
    await sleep(1);
    await sleep(1);
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tabButton = canvas.getAllByRole('tab');
    await userEvent.click(tabButton[0]);
};

export const EmptyElementsTab = Template.bind({});
EmptyElementsTab.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);
};
const emptyData = deepCopy(trucksMockVConfig) as I3DScenesConfig;
emptyData.configuration.scenes = [
    {
        ...emptyData.configuration.scenes[0],
        elements: []
    }
];
EmptyElementsTab.parameters = {
    data: emptyData
};

export const Search = Template.bind({});
Search.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);

    const canvas = within(context.canvasElement);
    // type in the search box
    const searchBox = canvas.getByTestId('search-header-search-box');
    await userEvent.type(searchBox, 'box');
};

export const EmptySearch = Template.bind({});
EmptySearch.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);

    const canvas = within(context.canvasElement);
    // type in the search box
    const searchBox = canvas.getByTestId('search-header-search-box');
    await userEvent.type(searchBox, 'unknown value');
};

const mockElement: IElement = {
    type: 'TwinToObjectMapping',
    id: '5ba433d52b8445979fabc818fd40ae3d',
    displayName: 'leftWheels',
    primaryTwinID: 'SaltMachine_C1',
    objectIDs: ['wheel1Mesh_primitive0', 'wheel2Mesh_primitive0'],
    extensionProperties: {}
};
const longData = deepCopy(trucksMockVConfig) as I3DScenesConfig;
longData.configuration.scenes = [
    {
        ...longData.configuration.scenes[0],
        elements: [
            ...longData.configuration.scenes[0].elements,
            {
                ...mockElement,
                id: 'element1',
                displayName: 'element 1'
            },
            {
                ...mockElement,
                id: 'element2',
                displayName: 'element 2'
            },
            {
                ...mockElement,
                id: 'element3',
                displayName: 'element 3'
            },
            {
                ...mockElement,
                id: 'element4',
                displayName: 'element 4'
            },
            {
                ...mockElement,
                id: 'element5',
                displayName: 'element 5'
            }
        ]
    }
];
export const Scrolling = Template.bind({});
Scrolling.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);
};
Scrolling.parameters = {
    data: longData
};

export const MultiSelect = Template.bind({});
MultiSelect.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);

    const canvas = within(context.canvasElement);
    // toggle multi select
    const toggle = canvas.getByTestId('search-header-multi-select');
    await userEvent.click(toggle);

    // click a list item
    const listItem = canvas.getByText('box1');
    await userEvent.click(listItem);
};

export const MoreMenuShow = Template.bind({});
MoreMenuShow.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    const moreMenu = await canvas.findByTestId(
        'context-menu-elements-in-scene-1-moreMenu'
    );
    await userEvent.click(moreMenu);
};

export const EditItemMeshTab = Template.bind({});
EditItemMeshTab.play = async (context) => {
    // switch to the elements tab
    await ElementsTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-1'
    );
    await userEvent.click(listItem);
};

export const EditMeshTabDelete = Template.bind({});
EditMeshTabDelete.play = async (context) => {
    // switch to the elements tab & edit
    await EditItemMeshTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-secondary-action-0'
    );
    await userEvent.click(listItem);
};

export const EditBehaviorsTab = Template.bind({});
EditBehaviorsTab.play = async (context) => {
    // switch to the elements tab & edit
    await EditItemMeshTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    // Finds the tabs and clicks the first one
    const tabs = await canvas.findAllByRole('tab');
    await userEvent.click(tabs[1]);
};

export const EditBehaviorsTabAddOpenCallout = Template.bind({});
EditBehaviorsTabAddOpenCallout.play = async (context) => {
    // switch to the elements tab & edit & switch to Behaviors tab
    await EditBehaviorsTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    const listItem = await canvas.findByTestId('element-add-behavior');
    await userEvent.click(listItem);
    // let the callout animate
    await sleep(500);
};

export const EditBehaviorsTabAddSearch = Template.bind({});
EditBehaviorsTabAddSearch.play = async (context) => {
    // open the add behavior callout
    await EditBehaviorsTabAddOpenCallout.play(context);

    // click a list item
    const searchBox = await findCalloutItemByTestId('behavior-callout-search');
    await userEvent.type(searchBox, 'hot');
};

// TODO_FIX_INTERACTION_TEST
// export const EditBehaviorsTabAddSelect = Template.bind({});
// EditBehaviorsTabAddSelect.play = async ({ canvasElement }) => {
//     // open the add behavior callout
//     await EditBehaviorsTabAddOpenCallout.play({ canvasElement });

//     // click a list item
//     const listItem = await findCalloutItemByTestId(
//         'cardboard-list-item-behavior-callout-list-0'
//     );
//     await userEvent.click(listItem);
// };

// TODO_FIX_INTERACTION_TEST
// export const EditBehaviorsTabAddThenOpenMenu = Template.bind({});
// EditBehaviorsTabAddThenOpenMenu.play = async ({ canvasElement }) => {
//     // open the add behavior callout
//     await EditBehaviorsTabAddSelect.play({ canvasElement });
//     await sleep(1);

//     // click a list item
//     const canvas = within(canvasElement);
//     const listItem = await canvas.findByTestId(
//         'context-menu-behavior-list-0-moreMenu'
//     );
//     await userEvent.click(listItem);
//     // let the callout animate
//     await sleep(1000);
// };

// TODO_FIX_INTERACTION_TEST
// export const EditBehaviorsTabEditBehavior = Template.bind({});
// EditBehaviorsTabEditBehavior.play = async ({ canvasElement }) => {
//     // open the add behavior callout
//     await EditBehaviorsTabAddThenOpenMenu.play({ canvasElement });

//     // click a list item
//     const listItem = await findOverflowMenuItemByTestId('modifyOverflow');
//     await clickOverFlowMenuItem(listItem);
// };

// TODO_FIX_INTERACTION_TEST
// export const EditBehaviorsTabRemoveBehavior = Template.bind({});
// EditBehaviorsTabRemoveBehavior.play = async ({ canvasElement }) => {
//     // open the add behavior callout
//     await EditBehaviorsTabAddThenOpenMenu.play({ canvasElement });

//     // click a list item
//     const listItem = await findOverflowMenuItemByTestId('removeOverflow');
//     await clickOverFlowMenuItem(listItem);
// };

export const EditAliasedTwinsTab = Template.bind({});
EditAliasedTwinsTab.play = async (context) => {
    // switch to the elements tab & edit
    await EditItemMeshTab.play(context);

    // click a list item
    const canvas = within(context.canvasElement);
    // Finds the tabs and clicks one
    const tabs = await canvas.findAllByRole('tab');
    await userEvent.click(tabs[2]);
};
