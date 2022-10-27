import React from 'react';
import OATModelList from './OATModelList';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    IStoryContext,
    sleep
} from '../../Models/Services/StoryUtilities';
import { DtdlInterface } from '../../Models/Constants';
import { getMockModelItem } from '../../Models/Context/OatPageContext/OatPageContext.mock';
import { userEvent, within } from '@storybook/testing-library';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 8
};

export default {
    title: 'Components - OAT/OATModelList',
    component: OATModelList,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const modelList: DtdlInterface[] = [
    getMockModelItem('item-1'),
    getMockModelItem('item-2'),
    getMockModelItem('item-3'),
    getMockModelItem('item-4')
];

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    _context: IStoryContext<any>
) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{ currentOntologyModels: modelList }}
        >
            <CommandHistoryContextProvider>
                <OATModelList />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({});

export const Search = Template.bind({});
Search.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // type in the search box
    const searchBox = canvas.getByTestId('models-list-search-box');
    userEvent.type(searchBox, '1');
    await sleep(1);
};

export const SelectItem = Template.bind({});
SelectItem.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId('cardboard-list-item-model-list-1');
    userEvent.click(menu);
};

export const OpenItemMenu = Template.bind({});
OpenItemMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId(
        'context-menu-model-list-1-moreMenu'
    );
    userEvent.click(menu);
};
