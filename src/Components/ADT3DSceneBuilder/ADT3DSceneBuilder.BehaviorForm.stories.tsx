import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import {
    clickOverFlowMenuItem,
    findOverflowMenuItem,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { deepCopy } from '../../Models/Services/Utils';
import { sleep } from '../AutoComplete/AutoComplete';

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

export const NewVisualRuleTabNoElements = Template.bind({});
NewVisualRuleTabNoElements.play = async ({ canvasElement }) => {
    await NewElementsTab.play({ canvasElement });

    const canvas = within(canvasElement);
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const NewVisualRuleTabWithElements = Template.bind({});
NewVisualRuleTabWithElements.play = async ({ canvasElement }) => {
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

export const EditVisualRuleTab = Template.bind({});
EditVisualRuleTab.play = async ({ canvasElement }) => {
    await EditElementsTabSelectItem.play({ canvasElement });
    const canvas = within(canvasElement);
    // Finds the tabs and clicks Visual rules
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditVisualRuleTabRemoveRule = Template.bind({});
EditVisualRuleTabRemoveRule.play = async ({ canvasElement }) => {
    await EditVisualRuleTab.play({ canvasElement });
    // Open overflow menu
    const canvas = within(canvasElement);
    const moreMenu = await canvas.findByTestId(
        'context-menu-visualRules-in-behavior-0-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);

    const deleteButton = await findOverflowMenuItem('removeRuleOverflow');
    await clickOverFlowMenuItem(deleteButton);
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
