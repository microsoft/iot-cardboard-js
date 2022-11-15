import React from 'react';
import { ComponentStory } from '@storybook/react';
import { within, userEvent, screen } from '@storybook/testing-library';
import OATEditorPage from './OATEditorPage';
import {
    getDefaultStoryDecorator,
    IStoryContext,
    sleep
} from '../../Models/Services/StoryUtilities';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 8
};
export default {
    title: 'Pages/OATEditorPage/Interactions',
    component: OATEditorPage,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    context: IStoryContext<any>
) => {
    return (
        <OATEditorPage
            selectedThemeName={
                context?.parameters?.theme || context?.globals?.theme
            }
            locale={context?.parameters?.locale}
            disableStorage={true}
        />
    );
};

export const FileMenu = Template.bind({});
FileMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId('oat-header-ontology-menu');
    userEvent.click(menu);

    // wait for the menu
    await sleep(100);
};

export const AddModel = Template.bind({});
AddModel.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = (await canvas.findAllByTestId('oat-header-new-menu'))[1];
    userEvent.click(menu);
};

// export const AddThenDuplicate = Template.bind({});
// AddThenDuplicate.play = async ({ canvasElement }) => {
//     // add a model
//     // await AddModel.play({ canvasElement });

//     await FileMenu.play({ canvasElement });

//     // click the sub menu button
//     const button = await findCalloutItemByTestId(
//         'oat-header-ontology-menu-copy'
//     );
//     button.click();
// };

// export const AddThenDuplicateThenSwitch = Template.bind({});
// AddThenDuplicateThenSwitch.play = async ({ canvasElement }) => {
//     // add, duplicate/switch
//     await AddThenDuplicate.play({ canvasElement });

//     // switch back
//     await FileMenu.play({ canvasElement });

//     // click the sub menu button
//     const button = await findCalloutItemByTestId(
//         'oat-header-ontology-menu-switch'
//     );
//     button.click();

//     await waitForAnimations();

//     // click the other project
//     const projectSubMenuItem = await screen.findAllByRole('menuitem');
//     projectSubMenuItem[11].click();
// };

export const AddMultipleModels = Template.bind({});
AddMultipleModels.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Clicks the button
    const menu = (await canvas.findAllByTestId('oat-header-new-menu'))[1];
    userEvent.click(menu);
    await sleep(10);
    userEvent.click(menu);
    await sleep(10);
    userEvent.click(menu);
};

export const SelectModel = Template.bind({});
SelectModel.play = async ({ canvasElement }) => {
    await AddModel.play({ canvasElement });

    // Clicks the button
    const menu = await screen.findByTestId('cardboard-list-item-models-list-0');
    menu.click();
};
