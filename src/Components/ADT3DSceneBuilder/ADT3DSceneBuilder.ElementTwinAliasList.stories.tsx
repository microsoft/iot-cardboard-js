import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import {
    IStoryContext,
    sleep,
    findOverflowMenuItem as findOverflowMenuItemByTestId,
    clickOverFlowMenuItem
} from '../../Models/Services/StoryUtilities';
import { IADT3DSceneBuilderCardProps } from './ADT3DSceneBuilder.types';
import trucksMockVConfig from '../../Adapters/__mockData__/TruckAndMachinesConfig.json';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Components/ADT3DSceneBuilder/Elements',
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
    // Finds the elements tab
    const elementsTabButton = (await canvas.findAllByRole('tab'))[0];
    await userEvent.click(elementsTabButton);

    // click the element
    const elementListItem = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-0'
    );
    await userEvent.click(elementListItem);

    // Finds the tabs and clicks Aliased Twins
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditTwinAliasTabList = Template.bind({});
EditTwinAliasTabList.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the elements tab
    const elementsTabButton = (await canvas.findAllByRole('tab'))[0];
    await userEvent.click(elementsTabButton);

    // click the "tank" element
    const elementListItem = await canvas.findByTestId(
        'cardboard-list-item-elements-in-scene-2'
    );
    await userEvent.click(elementListItem);

    // Finds the tabs and clicks Aliased Twins
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[2]);
};

export const EditTwinAliasListTabItemMenu = Template.bind({});
EditTwinAliasListTabItemMenu.play = async ({ canvasElement }) => {
    await EditTwinAliasTabList.play({ canvasElement });
    const canvas = within(canvasElement);

    // Find overflow menu of the first twin alias
    const twinAliasItem1MoreMenu = await canvas.findByTestId(
        'context-menu-element-aliased-twin-list-0-moreMenu'
    );

    await userEvent.click(twinAliasItem1MoreMenu);
};

export const EditTwinAliasTabRemove = Template.bind({});
EditTwinAliasTabRemove.play = async ({ canvasElement }) => {
    await EditTwinAliasListTabItemMenu.play({ canvasElement });
    await sleep(1000);

    // Find the remove item in the overflow menu in twin alias list item
    const removeOverflowItem = await findOverflowMenuItemByTestId(
        'elementTwinAlias-removeOverflow'
    );
    await clickOverFlowMenuItem(removeOverflowItem);
};
