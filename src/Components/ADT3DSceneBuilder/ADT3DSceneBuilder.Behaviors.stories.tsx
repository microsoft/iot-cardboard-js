import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import mockVConfig from '../../Adapters/__mockData__/vconfigDecFinal.json';
import {
    clickOverFlowMenuItem,
    findDialogMenuItem,
    findOverflowMenuItem,
    IStoryContext,
    sleep
} from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';

export default {
    title: 'Components/ADT3DSceneBuilder/Behaviors',
    parameters: {
        // delay for the menus showing up
        chromatic: { delay: 1000 }
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
) => {
    console.log(
        `**running story. Globals, Parameters`,
        context.globals,
        context.parameters
    );
    return (
        <div style={cardStyle}>
            <ADT3DSceneBuilder
                title={'3D Scene Builder'}
                theme={context.globals.theme}
                locale={context.globals.locale}
                adapter={
                    new MockAdapter({
                        mockData: context.parameters.data
                            ? JSON.parse(
                                  JSON.stringify(context.parameters.data)
                              )
                            : undefined
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

export const Search = Template.bind({});
Search.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const searchBox = canvas.getByTestId('search-header-search-box');
    await userEvent.type(searchBox, 'wheels');
};

const mockBehavior = {
    id: 'wheelsTooLow',
    type: 'Behavior',
    layers: ['PhysicalProperties'],
    datasources: [
        {
            type: 'TwinToObjectMappingDatasource',
            mappingIDs: [
                '5ba433d52b8445979fabc818fd40ae3d',
                '2aa6955f3c73418a9be0f7b19c019b75'
            ]
        }
    ],
    visuals: []
};
const longData = JSON.parse(JSON.stringify(mockVConfig));
longData.viewerConfiguration.scenes = [
    {
        ...longData.viewerConfiguration.scenes[0],
        behaviors: [
            ...longData.viewerConfiguration.scenes[0].behaviors,
            'behavior1',
            'behavior2',
            'behavior3',
            'behavior4'
        ]
    }
];
longData.viewerConfiguration.behaviors = [
    ...longData.viewerConfiguration.behaviors,
    {
        ...mockBehavior,
        id: 'behavior1'
    },
    {
        ...mockBehavior,
        id: 'behavior2'
    },
    {
        ...mockBehavior,
        id: 'behavior3'
    },
    {
        ...mockBehavior,
        id: 'behavior4'
    }
];
export const Scrolling = Template.bind({});
Scrolling.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });
};
Scrolling.parameters = {
    data: longData
};

const longDataWithRemoved = JSON.parse(JSON.stringify(mockVConfig));
longDataWithRemoved.viewerConfiguration.behaviors = [
    ...longDataWithRemoved.viewerConfiguration.behaviors,
    {
        ...mockBehavior,
        id: 'behavior5'
    },
    {
        ...mockBehavior,
        id: 'behavior6'
    },
    {
        ...mockBehavior,
        id: 'behavior7'
    }
];
export const ScrollingWithRemoved = Template.bind({});
ScrollingWithRemoved.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });
};
ScrollingWithRemoved.parameters = {
    data: longDataWithRemoved
};

export const ScrollingWithRemovedExpanded = Template.bind({});
ScrollingWithRemovedExpanded.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await ScrollingWithRemoved.play({ canvasElement });
    // Click the section header
    const canvas = within(canvasElement);
    const sectionHeader = await canvas.findByTestId(
        'behaviors-in-other-scenes-button'
    );
    await userEvent.click(sectionHeader);
};
ScrollingWithRemovedExpanded.parameters = {
    data: longDataWithRemoved
};

export const MoreMenuShow = Template.bind({});
MoreMenuShow.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-behaviors-in-scene-0-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const MoreMenuEdit = Template.bind({});
MoreMenuEdit.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await MoreMenuShow.play({ canvasElement });

    const moreMenus = await findOverflowMenuItem('editOverflow');
    await clickOverFlowMenuItem(moreMenus);
};

export const EditElementsTab = Template.bind({});
EditElementsTab.play = async ({ canvasElement }) => {
    await BehaviorsTab.play({ canvasElement });
    const canvas = within(canvasElement);
    // click the behavior
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-0'
    );
    await userEvent.click(listItem);

    // click one of the items in the elements list
    const elementListItem = await canvas.findByText('box1');
    await userEvent.click(elementListItem);
};

export const EditAlertsTab = Template.bind({});
EditAlertsTab.play = async ({ canvasElement }) => {
    await EditElementsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const EditWidgetsTab = Template.bind({});
EditWidgetsTab.play = async ({ canvasElement }) => {
    await EditElementsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditWidgetsTabEmpty = Template.bind({});
EditWidgetsTabEmpty.play = async ({ canvasElement }) => {
    await BehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // click the 3rd behavior
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-2'
    );
    await userEvent.click(listItem);
    await sleep(1);

    // switch to widgets tab
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditWidgetsTabMore = Template.bind({});
EditWidgetsTabMore.play = async ({ canvasElement, listItemIndex = 0 }) => {
    await EditWidgetsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const moreButton = await canvas.findByTestId(
        `context-menu-widgets-in-behavior-${listItemIndex}-moreMenu`
    );
    await userEvent.click(moreButton);
};

export const EditWidgetsTabMoreEditPanel = Template.bind({});
EditWidgetsTabMoreEditPanel.play = async ({ canvasElement }) => {
    await EditWidgetsTabMore.play({ canvasElement });
    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const EditWidgetsTabMoreEditLink = Template.bind({});
EditWidgetsTabMoreEditLink.play = async ({ canvasElement }) => {
    await EditWidgetsTabMore.play({ canvasElement, listItemIndex: 2 });
    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const EditWidgetsTabMoreRemove = Template.bind({});
EditWidgetsTabMoreRemove.play = async ({ canvasElement }) => {
    await EditWidgetsTabMore.play({ canvasElement });
    // Click the remove button in the overflow
    const removeButton = await findOverflowMenuItem('removeWidgetOverflow');
    await clickOverFlowMenuItem(removeButton);
};

export const EditWidgetsTabAddDialogShow = Template.bind({});
EditWidgetsTabAddDialogShow.play = async ({ canvasElement }) => {
    await EditWidgetsTab.play({ canvasElement });
    // Click the remove button in the overflow
    const canvas = within(canvasElement);
    const addButton = await canvas.findByTestId('widgetForm-addWidget');
    await userEvent.click(addButton);
};

export const RemoveDialogShow = Template.bind({});
RemoveDialogShow.play = async ({ canvasElement }) => {
    await MoreMenuShow.play({ canvasElement });
    const moreMenus = await findOverflowMenuItem('removeFromSceneOverflow');
    await clickOverFlowMenuItem(moreMenus);
};

export const RemoveDialogConfirmed = Template.bind({});
RemoveDialogConfirmed.play = async ({ canvasElement }) => {
    await RemoveDialogShow.play({ canvasElement });
    const button = await findDialogMenuItem('deleteDialog-confirm');
    await userEvent.click(button);
};

export const RemoveDialogCancel = Template.bind({});
RemoveDialogCancel.play = async ({ canvasElement }) => {
    await RemoveDialogShow.play({ canvasElement });
    const button = await findDialogMenuItem('deleteDialog-cancel');
    await userEvent.click(button);
};
