import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import { IStoryContext } from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
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
                            : trucksMockVConfig
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

//TODO_FIX_INTERACTION_TEST
// export const NewStateTabNoElements = Template.bind({});
// NewStateTabNoElements.play = async ({ canvasElement }) => {
//     await NewElementsTab.play({ canvasElement });

//     const canvas = within(canvasElement);
//     const tab = await canvas.findAllByRole('tab');
//     await userEvent.click(tab[2]);
// };

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
    await userEvent.click(tab[2]);
};

//TODO_FIX_INTERACTION_TEST
// export const NewStateTabWithElementsOpenProperty = Template.bind({});
// NewStateTabWithElementsOpenProperty.play = async ({ canvasElement }) => {
//     await NewStateTabWithElements.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // wait for dropdown to populate
//     await sleep(1);
//     await openDropdownMenu(canvas, 'behavior-form-state-property-dropdown');
// };

//TODO_FIX_INTERACTION_TEST
// export const NewStateTabWithElementsSelectProperty = Template.bind({});
// NewStateTabWithElementsSelectProperty.play = async ({ canvasElement }) => {
//     await NewStateTabWithElements.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // wait for dropdown to populate
//     await sleep(1);
//     await selectDropDownMenuItem(
//         canvas,
//         'behavior-form-state-property-dropdown',
//         2
//     );
// };

//TODO_FIX_INTERACTION_TEST
// export const NewAlertsTab = Template.bind({});
// NewAlertsTab.play = async ({ canvasElement }) => {
//     await NewElementsTab.play({ canvasElement });

//     const canvas = within(canvasElement);
//     const tab = await canvas.findAllByRole('tab');
//     await userEvent.click(tab[2]);
// };

export const NewWidgetsTab = Template.bind({});
NewWidgetsTab.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[4]);
};

export const EditElementsTab = Template.bind({});
EditElementsTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);

    // click the behavior
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-1'
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

export const EditTwinsAliasesTab = Template.bind({});
EditTwinsAliasesTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    const canvas = within(canvasElement);
    // Finds the tabs and clicks Twins
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const EditTwinAliasesTabAddAlias = Template.bind({});
EditTwinAliasesTabAddAlias.play = async ({ canvasElement }) => {
    await EditTwinsAliasesTab.play({ canvasElement });
    const canvas = within(canvasElement);
    const addTwinAliasButton = await canvas.findByTestId(
        'twinsTab-addTwinAlias'
    );
    await userEvent.click(addTwinAliasButton);
};

// export const EditStatusTab = Template.bind({});
// EditStatusTab.play = async ({ canvasElement }) => {
//     await EditElementsTabSelectItem.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // Finds the tabs and clicks Status
//     const tab = await canvas.findAllByRole('tab');
//     await userEvent.click(tab[2]);
// };

// export const EditStatusTabError = Template.bind({});
// EditStatusTabError.play = async ({ canvasElement }) => {
//     await EditStatusTab.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // add a row into an invalid state
//     const addButton = await canvas.findByTestId('range-builder-add');
//     await userEvent.click(addButton);
// };

// verify that switching tabs will persist state
// export const EditStatusTabSwitchTabs = Template.bind({});
// EditStatusTabSwitchTabs.play = async ({ canvasElement }) => {
//     await EditStatusTabError.play({ canvasElement });
//     // click one of the items in the list
//     const canvas = within(canvasElement);
//     // Finds the tabs and clicks the Elements
//     const elementsTab = (await canvas.findAllByRole('tab'))[0];
//     await userEvent.click(elementsTab);
//     // Finds the tabs and clicks the Status
//     const statusTab = (await canvas.findAllByRole('tab'))[2];
//     await userEvent.click(statusTab);
// };

// export const EditStatusTabRemoveRange = Template.bind({});
// EditStatusTabRemoveRange.play = async ({ canvasElement }) => {
//     await EditStatusTab.play({ canvasElement });
//     const canvas = within(canvasElement);
//     const deleteButtons = await canvas.findAllByTestId(
//         'range-builder-row-delete'
//     );
//     await userEvent.click(deleteButtons[0]);
//     await userEvent.click(deleteButtons[1]);
// };

// export const EditStatusTabRemoveRangeSave = Template.bind({});
// EditStatusTabRemoveRangeSave.play = async ({ canvasElement }) => {
//     await EditStatusTabRemoveRange.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // save
//     const saveButton = await canvas.findByTestId(
//         'behavior-form-primary-button'
//     );
//     await userEvent.click(saveButton);

//     await sleep(1);

//     // navigate back to editing the same item and go to the status tab
//     await EditElementsTab.play({ canvasElement });
//     // Finds the tabs and clicks the Status
//     const statusTab = (await canvas.findAllByRole('tab'))[2];
//     await userEvent.click(statusTab);
// };

// export const EditAlertsTab = Template.bind({});
// EditAlertsTab.play = async ({ canvasElement }) => {
//     await EditElementsTabSelectItem.play({ canvasElement });
//     // click one of the items in the list
//     const canvas = within(canvasElement);
//     // Finds the tabs and clicks Alerts
//     const tab = await canvas.findAllByRole('tab');
//     await userEvent.click(tab[3]);
// };

export const EditWidgetsTab = Template.bind({});
EditWidgetsTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[4]);
};
