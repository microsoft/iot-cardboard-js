import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, screen, within } from '@storybook/testing-library';
import MockAdapter from '../../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import mockVConfig from '../../../Adapters/__mockData__/vconfigDecFinal.json';
import { sleep, waitForFirstRender } from '../../../Utilities';

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

export const Mock3DBuilder = Template.bind({});

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
    const toggle = canvas.getByTitle('Toggle Checkboxes');
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
    const moreMenus = canvas.findAllByTitle('More');
    await userEvent.click(moreMenus[0]);
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
    const moreMenus = await canvas.findAllByTitle('More');
    await userEvent.click(moreMenus[0]);
    await sleep(1);
};

export const BehaviorsEdit = Template.bind({});
BehaviorsEdit.play = async ({ canvasElement }) => {
    await BehaviorsMoreMenuShow.play({ canvasElement });
    const moreMenus = await screen.findByTestId('editOverflow-wheelsTooLow');
    // not using storybook helper to work around issue where pointer events are not allowed
    moreMenus.click();
    await sleep(1);
    // click one of the items in the list
    const canvas = within(canvasElement);
    const listItem = canvas.getByText('box1');
    await userEvent.click(listItem);
};

export const BehaviorsRemoveDialogShow = Template.bind({});
BehaviorsRemoveDialogShow.play = async ({ canvasElement }) => {
    await BehaviorsMoreMenuShow.play({ canvasElement });
    const moreMenus = await screen.findByTestId(
        'removeFromSceneOverflow-wheelsTooLow'
    );
    // not using storybook helper to work around issue where pointer events are not allowed
    moreMenus.click();
    await sleep(1);
};

export const BehaviorsRemoveDialogConfirmed = Template.bind({});
BehaviorsRemoveDialogConfirmed.play = async ({ canvasElement }) => {
    await BehaviorsRemoveDialogShow.play({ canvasElement });
    const button = await screen.findByTestId('deleteDialog-confirm');
    await userEvent.click(button);
};

export const BehaviorsRemoveDialogCancel = Template.bind({});
BehaviorsRemoveDialogCancel.play = async ({ canvasElement }) => {
    await BehaviorsRemoveDialogShow.play({ canvasElement });
    const button = await screen.findByTestId('deleteDialog-cancel');
    await userEvent.click(button);
};

//#endregion
