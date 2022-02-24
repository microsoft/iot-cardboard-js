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
    sleep,
    waitForFirstRender
} from '../../Models/Services/StoryUtilities';

export default {
    title: 'Components/ADT3DSceneBuilder/Interactions'
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

//#region ELEMENTS

export const ElementsTab = Template.bind({});
ElementsTab.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const behaviorsTabButton = canvas.getAllByRole('tab');
    await userEvent.click(behaviorsTabButton[0]);
};

export const ElementsSearch = Template.bind({});
ElementsSearch.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await ElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const searchBox = canvas.getByPlaceholderText('Search elements');
    await userEvent.type(searchBox, 'box');
};

export const ElementsMultiSelect = Template.bind({});
ElementsMultiSelect.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await ElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // toggle multi select
    const toggle = canvas.getByTitle('Multi-select elements');
    await userEvent.click(toggle);

    // click a list item
    const listItem = canvas.getByText('box1');
    await userEvent.click(listItem);
};

export const ElementsMoreMenuShow = Template.bind({});
ElementsMoreMenuShow.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await ElementsTab.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const moreMenu = await canvas.findByTestId('moreMenu-0');
    await userEvent.click(moreMenu);
};

//#endregion
//#region BEHAVIORS

export const BehaviorsTab = Template.bind({});
BehaviorsTab.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the second one
    const behaviorsTabButton = await canvas.findAllByRole('tab');
    await userEvent.click(behaviorsTabButton[1]);
};

export const BehaviorsSearch = Template.bind({});
BehaviorsSearch.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const searchBox = await canvas.findByPlaceholderText('Search behaviors');
    await userEvent.type(searchBox, 'wheels');
};

export const BehaviorsMoreMenuShow = Template.bind({});
BehaviorsMoreMenuShow.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await BehaviorsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId('moreMenu-inScene-0');
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const BehaviorsEditElementsTab = Template.bind({});
BehaviorsEditElementsTab.play = async ({ canvasElement }) => {
    await BehaviorsMoreMenuShow.play({ canvasElement });
    const moreMenus = await findOverflowMenuItem('editOverflow-wheelsTooLow');
    // not using storybook helper to work around issue where pointer events are not allowed
    moreMenus.click();
    await sleep(1);
    // click one of the items in the list
    const canvas = within(canvasElement);
    const listItem = await canvas.findByText('box1');
    await userEvent.click(listItem);
};

export const BehaviorsEditAlertsTab = Template.bind({});
BehaviorsEditAlertsTab.play = async ({ canvasElement }) => {
    await BehaviorsEditElementsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[1]);
};

export const BehaviorsEditWidgetsTab = Template.bind({});
BehaviorsEditWidgetsTab.play = async ({ canvasElement }) => {
    await BehaviorsEditElementsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const BehaviorsEditWidgetsTabMore = Template.bind({});
BehaviorsEditWidgetsTabMore.play = async ({
    canvasElement,
    listItemIndex = 0
}) => {
    await BehaviorsEditWidgetsTab.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const moreButton = await canvas.findByTestId(`moreMenu-${listItemIndex}`);
    await userEvent.click(moreButton);
};

export const BehaviorsEditWidgetsTabMoreEditPanel = Template.bind({});
BehaviorsEditWidgetsTabMoreEditPanel.play = async ({ canvasElement }) => {
    await BehaviorsEditWidgetsTabMore.play({ canvasElement });
    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const BehaviorsEditWidgetsTabMoreEditLink = Template.bind({});
BehaviorsEditWidgetsTabMoreEditLink.play = async ({ canvasElement }) => {
    await BehaviorsEditWidgetsTabMore.play({ canvasElement, listItemIndex: 2 });
    // click the edit button in the overflow
    const editButton = await findOverflowMenuItem('editWidgetOverflow');
    await clickOverFlowMenuItem(editButton);
};

export const BehaviorsEditWidgetsTabMoreRemove = Template.bind({});
BehaviorsEditWidgetsTabMoreRemove.play = async ({ canvasElement }) => {
    await BehaviorsEditWidgetsTabMore.play({ canvasElement });
    // Click the remove button in the overflow
    const removeButton = await findOverflowMenuItem('removeWidgetOverflow');
    await clickOverFlowMenuItem(removeButton);
};

export const BehaviorsEditWidgetsTabAddDialogShow = Template.bind({});
BehaviorsEditWidgetsTabAddDialogShow.play = async ({ canvasElement }) => {
    await BehaviorsEditWidgetsTab.play({ canvasElement });
    // Click the remove button in the overflow
    const canvas = within(canvasElement);
    const addButton = await canvas.findByTestId('widgetForm-addWidget');
    await userEvent.click(addButton);
};

export const BehaviorsRemoveDialogShow = Template.bind({});
BehaviorsRemoveDialogShow.play = async ({ canvasElement }) => {
    await BehaviorsMoreMenuShow.play({ canvasElement });
    const moreMenus = await findOverflowMenuItem(
        'removeFromSceneOverflow-wheelsTooLow'
    );
    await clickOverFlowMenuItem(moreMenus);
};

export const BehaviorsRemoveDialogConfirmed = Template.bind({});
BehaviorsRemoveDialogConfirmed.play = async ({ canvasElement }) => {
    await BehaviorsRemoveDialogShow.play({ canvasElement });
    const button = await findDialogMenuItem('deleteDialog-confirm');
    await userEvent.click(button);
};

export const BehaviorsRemoveDialogCancel = Template.bind({});
BehaviorsRemoveDialogCancel.play = async ({ canvasElement }) => {
    await BehaviorsRemoveDialogShow.play({ canvasElement });
    const button = await findDialogMenuItem('deleteDialog-cancel');
    await userEvent.click(button);
};

//#endregion
