import React from 'react';
import OatEditorPage from './OATEditorPage';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { ComponentStory } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

const wrapperStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'absolute'
};
export default {
    title: 'Pages/OATEditorPage',
    component: OatEditorPage,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    context: IStoryContext<any>
) => {
    return (
        <OatEditorPage
            selectedThemeName={
                context.parameters.theme || context.globals.theme
            }
            locale={context.globals.locale}
            localeStrings={context.globals.locale}
        />
    );
};
export const SelectFirstModel = Template.bind({});
SelectFirstModel.play = async () => {
    // Clicks the button
    const menu = await screen.findByTestId('cardboard-list-item-models-list-6');
    menu.click();
};

export const OpenDetailsModalForModel = Template.bind({});
OpenDetailsModalForModel.play = async () => {
    await SelectFirstModel.play();

    // Clicks the button
    const menu = await screen.findByTestId(
        'property-editor-details-modal-button'
    );
    userEvent.click(menu);
};
