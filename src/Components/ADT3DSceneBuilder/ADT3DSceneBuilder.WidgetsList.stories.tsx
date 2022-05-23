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

export default {
    title: 'Components/ADT3DSceneBuilder/WidgetsList',
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

export const WidgetsList = Template.bind({});
WidgetsList.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the behaviors tab
    const behaviorsTabButton = (await canvas.findAllByRole('tab'))[1];
    await userEvent.click(behaviorsTabButton);

    // click the behavior
    const listItem = await canvas.findByTestId(
        'cardboard-list-item-behaviors-in-scene-1'
    );
    await userEvent.click(listItem);

    // click one of the items in the elements list
    const elementListItem = await canvas.findByText('box1');
    await userEvent.click(elementListItem);

    // click one of the items in the list
    // Finds the tabs and clicks the first one
    const tab = await canvas.findAllByRole('tab');
    await userEvent.click(tab[4]);
};

export const WidgetsListEmpty = Template.bind({});
WidgetsListEmpty.play = async ({ canvasElement }) => {
    await WidgetsList.play({ canvasElement });

    // remove the stock data
    const canvas = within(canvasElement);
    const moreButton1 = await canvas.findByTestId(
        `context-menu-widgets-in-behavior-0-moreMenu`
    );
    await userEvent.click(moreButton1);
    await clickOverFlowMenuItem(
        await findOverflowMenuItem('removeWidgetOverflow')
    );
    const moreButton2 = await canvas.findByTestId(
        `context-menu-widgets-in-behavior-0-moreMenu`
    );
    await userEvent.click(moreButton2);
    await clickOverFlowMenuItem(
        await findOverflowMenuItem('removeWidgetOverflow')
    );
    const moreButton3 = await canvas.findByTestId(
        `context-menu-widgets-in-behavior-0-moreMenu`
    );
    await userEvent.click(moreButton3);
    await clickOverFlowMenuItem(
        await findOverflowMenuItem('removeWidgetOverflow')
    );
};

export const WidgetsListMore = Template.bind({});
WidgetsListMore.play = async ({ canvasElement, listItemIndex = 0 }) => {
    await WidgetsList.play({ canvasElement });
    // click one of the items in the list
    const canvas = within(canvasElement);
    // Finds the tabs and clicks the first one
    const moreButton = await canvas.findByTestId(
        `context-menu-widgets-in-behavior-${listItemIndex}-moreMenu`
    );
    await userEvent.click(moreButton);
};

export const WidgetsListMoreRemove = Template.bind({});
WidgetsListMoreRemove.play = async ({ canvasElement }) => {
    await WidgetsListMore.play({ canvasElement });
    // Click the remove button in the overflow
    const removeButton = await findOverflowMenuItem('removeWidgetOverflow');
    await clickOverFlowMenuItem(removeButton);
};

export const WidgetsListAddDialogShow = Template.bind({});
WidgetsListAddDialogShow.play = async ({ canvasElement }) => {
    await WidgetsList.play({ canvasElement });
    // Click the remove button in the overflow
    const canvas = within(canvasElement);
    const addButton = await canvas.findByTestId('widgetForm-addWidget');
    await userEvent.click(addButton);
};
