import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import { IStoryContext, sleep } from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Components/ADT3DSceneBuilder/BehaviorForm',
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
                            : undefined
                    })
                }
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
                {..._args}
            />
        </div>
    );
};

export const NewElementsTab = Template.bind({});
NewElementsTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);

    // click the behavior
    const button = await canvas.findByTestId('behavior-list-new-button');
    await userEvent.click(button);
};

export const NewStateTabNoElements = Template.bind({});
NewStateTabNoElements.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const NewStateTabWithElements = Template.bind({});
NewStateTabWithElements.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    // select some elements
    const canvas = within(canvasElement);
    const listItem1 = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-0'
    );
    await userEvent.click(listItem1);
    const listItem2 = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-2'
    );
    await userEvent.click(listItem2);

    // switch tabs
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const NewAlertsTab = Template.bind({});
NewAlertsTab.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const NewWidgetsTab = Template.bind({});
NewWidgetsTab.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[3]);
};

export const EditElementsTab = Template.bind({});
EditElementsTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);

    // click the behavior
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-0'
    );
    await userEvent.click(listItem);
};

export const EditElementsTabSelectItem = Template.bind({});
EditElementsTabSelectItem.play = async ({ canvasElement }) => {
    await EditElementsTab.play({ canvasElement });
    const canvas = within(canvasElement);

    // click one of the items in the elements list
    const elementListItem = await canvas.findByText('box1');
    await userEvent.click(elementListItem);
};

export const EditAlertsTab = Template.bind({});
EditAlertsTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks Alerts
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditStatusTab = Template.bind({});
EditStatusTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    const canvas = within(canvasElement);
    // Finds the tabs and clicks Status
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const EditStatusTabError = Template.bind({});
EditStatusTabError.play = async ({ canvasElement }) => {
    await EditStatusTab.play({ canvasElement });
    const canvas = within(canvasElement);
    // add a row into an invalid state
    const addButton = await canvas.findByTestId('range-builder-add');
    await userEvent.click(addButton);
};

// verify that switching tabs will persist state
export const EditStatusTabSwitchTabs = Template.bind({});
EditStatusTabSwitchTabs.play = async ({ canvasElement }) => {
    await EditStatusTabError.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the Elements
    const elementsTab = (await canvas.findAllByRole('tab'))[0];
    await userEvent.click(elementsTab);
    // Finds the tabs and clicks the Status
    const statusTab = (await canvas.findAllByRole('tab'))[1];
    await userEvent.click(statusTab);
};

export const EditStatusTabRemoveRange = Template.bind({});
EditStatusTabRemoveRange.play = async ({ canvasElement }) => {
    await EditStatusTab.play({ canvasElement });
    const canvas = within(canvasElement);
    const deleteButtons = await canvas.findAllByTestId(
        'range-builder-row-delete'
    );
    await userEvent.click(deleteButtons[0]);
    await userEvent.click(deleteButtons[1]);
};

export const EditStatusTabRemoveRangeSave = Template.bind({});
EditStatusTabRemoveRangeSave.play = async ({ canvasElement }) => {
    await EditStatusTabRemoveRange.play({ canvasElement });
    const canvas = within(canvasElement);
    // save
    const saveButton = await canvas.findByTestId(
        'behavior-form-primary-button'
    );
    await userEvent.click(saveButton);

    await sleep(1);

    // navigate back to editing the same item and go to the status tab
    await EditElementsTab.play({ canvasElement });
    // Finds the tabs and clicks the Status
    const statusTab = (await canvas.findAllByRole('tab'))[1];
    await userEvent.click(statusTab);
};

export const EditWidgetsTab = Template.bind({});
EditWidgetsTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[3]);
};

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabEmpty = Template.bind({});
// EditWidgetsTabEmpty.play = async ({ canvasElement }) => {
//     await BehaviorsTab.play({ canvasElement });

//     const canvas = within(canvasElement);
//     // click the 3rd behavior
//     const listItem = await canvas.findByTestId(
//         'cardboard-list-item-behaviors-in-scene-2'
//     );
//     await userEvent.click(listItem);
//     await sleep(1);

//     // switch to widgets tab
//     const tab = await canvas.findAllByRole('tab');
//     await userEvent.click(tab[2]);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabMore = Template.bind({});
// EditWidgetsTabMore.play = async ({ canvasElement, listItemIndex = 0 }) => {
//     await EditWidgetsTab.play({ canvasElement });
//     // click one of the items in the list
//     const canvas = within(canvasElement);
//     // Finds the tabs and clicks the first one
//     const moreButton = await canvas.findByTestId(
//         `context-menu-widgets-in-behavior-${listItemIndex}-moreMenu`
//     );
//     await userEvent.click(moreButton);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabMoreEditPanel = Template.bind({});
// EditWidgetsTabMoreEditPanel.play = async ({ canvasElement }) => {
//     await EditWidgetsTabMore.play({ canvasElement });
//     // click the edit button in the overflow
//     const editButton = await findOverflowMenuItem('editWidgetOverflow');
//     await clickOverFlowMenuItem(editButton);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabMoreEditLink = Template.bind({});
// EditWidgetsTabMoreEditLink.play = async ({ canvasElement }) => {
//     await EditWidgetsTabMore.play({ canvasElement, listItemIndex: 2 });
//     // click the edit button in the overflow
//     const editButton = await findOverflowMenuItem('editWidgetOverflow');
//     await clickOverFlowMenuItem(editButton);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabEditGauge = Template.bind({});
// EditWidgetsTabEditGauge.play = async ({ canvasElement }) => {
//     await EditWidgetsTabAddDialogShow.play({ canvasElement });
//     // mock data does not have a gauge so we go through the flow to add one
//     const gaugeButton = await findCalloutItemByTestId('widget-library-Gauge');
//     await userEvent.click(gaugeButton);
//     const addButton = await findCalloutItemByTestId(
//         'widget-library-add-button'
//     );
//     await userEvent.click(addButton);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabMoreRemove = Template.bind({});
// EditWidgetsTabMoreRemove.play = async ({ canvasElement }) => {
//     await EditWidgetsTabMore.play({ canvasElement });
//     // Click the remove button in the overflow
//     const removeButton = await findOverflowMenuItem('removeWidgetOverflow');
//     await clickOverFlowMenuItem(removeButton);
// };

// TODO SCHEMA MIGRATION - alerts and widgets awaiting schema v2 support
// export const EditWidgetsTabAddDialogShow = Template.bind({});
// EditWidgetsTabAddDialogShow.play = async ({ canvasElement }) => {
//     await EditWidgetsTab.play({ canvasElement });
//     // Click the remove button in the overflow
//     const canvas = within(canvasElement);
//     const addButton = await canvas.findByTestId('widgetForm-addWidget');
//     await userEvent.click(addButton);
// };
