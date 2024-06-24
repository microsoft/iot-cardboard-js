import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import {
    clickOverFlowMenuItem,
    findDialogMenuItem,
    findOverflowMenuItem,
    IStoryContext,
    sleep
} from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import {
    I3DScenesConfig,
    IBehavior
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Components/ADT3DSceneBuilder/BehaviorsList',
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

export const BehaviorsTab = Template.bind({});
BehaviorsTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);
};

export const EmptyBehaviorsList = Template.bind({});
const emptyBehaviorsData = deepCopy(trucksMockVConfig);
emptyBehaviorsData.configuration.behaviors = [];
EmptyBehaviorsList.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);
};
EmptyBehaviorsList.parameters = {
    data: emptyBehaviorsData
};

export const Search = Template.bind({});
Search.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);

    const canvas = within(context.canvasElement);
    // type in the search box
    const searchBox = canvas.getByTestId('search-header-search-box');
    await userEvent.type(searchBox, 'wheels');
};

export const EmptySearch = Template.bind({});
EmptySearch.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);

    const canvas = within(context.canvasElement);
    // type in the search box
    const searchBox = canvas.getByTestId('search-header-search-box');
    await userEvent.type(searchBox, 'unknown value');
};

const mockBehavior: IBehavior = {
    id: 'bf1ec41d7886438d880c140fb1bb570a',
    displayName: 'Wheels too low',
    datasources: [
        {
            type: 'ElementTwinToObjectMappingDataSource',
            elementIDs: ['5ba433d52b8445979fabc818fd40ae3d'],
            extensionProperties: {}
        },
        {
            type: 'ElementTwinToObjectMappingDataSource',
            elementIDs: ['4cb0990d646a4bbea3e1102676e200fe']
        }
    ],
    visuals: []
};
const longData = deepCopy(trucksMockVConfig) as I3DScenesConfig;
longData.configuration.scenes = [
    {
        ...longData.configuration.scenes[0],
        behaviorIDs: [
            ...longData.configuration.scenes[0].behaviorIDs,
            'behavior1',
            'behavior2',
            'behavior3',
            'behavior4',
            'behavior5',
            'behavior6'
        ]
    }
];
longData.configuration.behaviors = [
    ...longData.configuration.behaviors,
    {
        ...mockBehavior,
        displayName: 'behavior 1',
        id: 'behavior1'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 2',
        id: 'behavior2'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 3',
        id: 'behavior3'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 4',
        id: 'behavior4'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 5',
        id: 'behavior5'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 6',
        id: 'behavior6'
    }
];
export const Scrolling = Template.bind({});
Scrolling.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);
};
Scrolling.parameters = {
    data: longData
};

const longDataWithRemoved = deepCopy(trucksMockVConfig) as I3DScenesConfig;
longDataWithRemoved.configuration.behaviors = [
    ...longDataWithRemoved.configuration.behaviors,
    {
        ...mockBehavior,
        displayName: 'behavior 3',
        id: 'behavior3'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 4',
        id: 'behavior4'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 5',
        id: 'behavior5'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 6',
        id: 'behavior6'
    },
    {
        ...mockBehavior,
        displayName: 'behavior 7',
        id: 'behavior7'
    }
];
export const WithRemoved = Template.bind({});
WithRemoved.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);
};
WithRemoved.parameters = {
    data: longDataWithRemoved
};

export const ScrollingWithRemovedExpanded = Template.bind({});
ScrollingWithRemovedExpanded.play = async (context) => {
    // switch to the behaviors tab
    await WithRemoved.play(context);
    // Click the section header
    const canvas = within(context.canvasElement);
    const sectionHeader = await canvas.findByTestId(
        'behaviors-in-other-scenes-button'
    );
    await userEvent.click(sectionHeader);
};
ScrollingWithRemovedExpanded.parameters = {
    data: longDataWithRemoved
};

export const MoreMenuShow = Template.bind({});
MoreMenuShow.play = async (context) => {
    // switch to the behaviors tab
    await BehaviorsTab.play(context);

    const canvas = within(context.canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-behaviors-in-scene-1-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const MoreMenuEdit = Template.bind({});
MoreMenuEdit.play = async (context) => {
    // switch to the behaviors tab
    await MoreMenuShow.play(context);

    const moreMenus = await findOverflowMenuItem('editOverflow');
    await clickOverFlowMenuItem(moreMenus);
};

export const RemoveDialogShow = Template.bind({});
RemoveDialogShow.play = async (context) => {
    await MoreMenuShow.play(context);
    const moreMenus = await findOverflowMenuItem('removeFromSceneOverflow');
    await clickOverFlowMenuItem(moreMenus);
};

export const RemoveDialogConfirmed = Template.bind({});
RemoveDialogConfirmed.play = async (context) => {
    await RemoveDialogShow.play(context);
    const button = await findDialogMenuItem('deleteDialog-confirm');
    await userEvent.click(button);
};

export const RemoveDialogCancel = Template.bind({});
RemoveDialogCancel.play = async (context) => {
    await RemoveDialogShow.play(context);
    const button = await findDialogMenuItem('deleteDialog-cancel');
    await userEvent.click(button);
};
