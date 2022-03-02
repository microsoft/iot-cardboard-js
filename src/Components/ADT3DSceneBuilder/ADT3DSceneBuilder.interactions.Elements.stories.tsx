import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import mockVConfig from '../../Adapters/__mockData__/vconfigDecFinal.json';
import {
    clickOverFlowMenuItem,
    findCalloutItemByTestId,
    findOverflowMenuItem as findOverflowMenuItemByTestId,
    sleep,
    waitForFirstRender
} from '../../Models/Services/StoryUtilities';

export default {
    title: 'Components/ADT3DSceneBuilder/Interactions/Elements',
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
const Template: SceneBuilderStory = (_args, { globals: { theme, locale } }) => (
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

export const ElementsTab = Template.bind({});
ElementsTab.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const behaviorsTabButton = canvas.getAllByRole('tab');
    await userEvent.click(behaviorsTabButton[0]);
};

export const Search = Template.bind({});
Search.play = async ({ canvasElement }) => {
    // switch to the behaviors tab
    await ElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    // type in the search box
    const searchBox = canvas.getByPlaceholderText('Search elements');
    await userEvent.type(searchBox, 'box');
};

export const MultiSelect = Template.bind({});
MultiSelect.play = async ({ canvasElement }) => {
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

export const MoreMenuShow = Template.bind({});
MoreMenuShow.play = async ({ canvasElement }) => {
    // switch to the elements tab
    await ElementsTab.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const moreMenu = await canvas.findByTestId('moreMenu-0');
    await userEvent.click(moreMenu);
};

export const EditItem = Template.bind({});
EditItem.play = async ({ canvasElement }) => {
    // switch to the elements tab
    await ElementsTab.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-1'
    );
    await userEvent.click(listItem);
};

export const EditMeshTabDelete = Template.bind({});
EditMeshTabDelete.play = async ({ canvasElement }) => {
    // switch to the elements tab & edit
    await EditItem.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-mesh-list-0'
    );
    await userEvent.click(listItem);
};

export const EditBehaviorsTab = Template.bind({});
EditBehaviorsTab.play = async ({ canvasElement }) => {
    // switch to the elements tab & edit
    await EditItem.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const tabs = await canvas.findAllByRole('tab');
    await userEvent.click(tabs[1]);
};

export const EditBehaviorsTabAddOpenCallout = Template.bind({});
EditBehaviorsTabAddOpenCallout.play = async ({ canvasElement }) => {
    // switch to the elements tab & edit & switch to Behaviors tab
    await EditBehaviorsTab.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const listItem = await canvas.findByTestId('element-add-behavior');
    await userEvent.click(listItem);
    // let the callout animate
    await sleep(500);
};

export const EditBehaviorsTabAddSearch = Template.bind({});
EditBehaviorsTabAddSearch.play = async ({ canvasElement }) => {
    // open the add behavior callout
    await EditBehaviorsTabAddOpenCallout.play({ canvasElement });

    // click a list item
    const searchBox = await findCalloutItemByTestId('behavior-callout-search');
    await userEvent.type(searchBox, 'hot');
};

export const EditBehaviorsTabAddSelect = Template.bind({});
EditBehaviorsTabAddSelect.play = async ({ canvasElement }) => {
    // open the add behavior callout
    await EditBehaviorsTabAddOpenCallout.play({ canvasElement });

    // click a list item
    const listItem = await findCalloutItemByTestId(
        'cardboard-list-item-behavior-callout-list-0'
    );
    await userEvent.click(listItem);
};

export const EditBehaviorsTabAddThenOpenMenu = Template.bind({});
EditBehaviorsTabAddThenOpenMenu.play = async ({ canvasElement }) => {
    // open the add behavior callout
    await EditBehaviorsTabAddSelect.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    const listItem = await canvas.findByTestId(
        'context-menu-behavior-list-0-moreMenu'
    );
    await userEvent.click(listItem);
    // let the callout animate
    await sleep(50);
};

export const EditBehaviorsTabEditBehavior = Template.bind({});
EditBehaviorsTabEditBehavior.play = async ({ canvasElement }) => {
    // open the add behavior callout
    await EditBehaviorsTabAddThenOpenMenu.play({ canvasElement });

    // click a list item
    const listItem = await findOverflowMenuItemByTestId('modifyOverflow');
    await clickOverFlowMenuItem(listItem);
};

export const EditBehaviorsTabRemoveBehavior = Template.bind({});
EditBehaviorsTabRemoveBehavior.play = async ({ canvasElement }) => {
    // open the add behavior callout
    await EditBehaviorsTabAddThenOpenMenu.play({ canvasElement });

    // click a list item
    const listItem = await findOverflowMenuItemByTestId('removeOverflow');
    await clickOverFlowMenuItem(listItem);
};

export const EditAliasedTwinsTab = Template.bind({});
EditAliasedTwinsTab.play = async ({ canvasElement }) => {
    // switch to the elements tab & edit
    await EditItem.play({ canvasElement });

    // click a list item
    const canvas = within(canvasElement);
    // Finds the tabs and clicks one
    const tabs = await canvas.findAllByRole('tab');
    await userEvent.click(tabs[2]);
};
