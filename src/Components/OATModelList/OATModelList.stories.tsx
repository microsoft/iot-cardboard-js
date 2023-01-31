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
import { getMockFile } from '../../Models/Context/OatPageContext/OatPageContext.mock';
import { userEvent, within } from '@storybook/testing-library';
import { IOatPageContextState } from '../../Models/Context/OatPageContext/OatPageContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 8
};

export default {
    title: 'Components - OAT/OATModelList',
    component: OATModelList,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type StoryProps = {
    initialState?: Partial<IOatPageContextState>;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<any>
) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                ontologyFiles: [getMockFile(0, '123', '234')],
                currentOntologyId: 'something',
                ...args?.initialState
            }}
        >
            <CommandHistoryContextProvider>
                <OATModelList />
            </CommandHistoryContextProvider>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({});

export const NoData = Template.bind({});
NoData.args = {
    initialState: {
        ontologyFiles: []
    }
} as StoryProps;

export const SearchWithMatch = Template.bind({});
SearchWithMatch.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // type in the search box
    const searchBox = canvas.getByTestId('models-list-search-box');
    userEvent.type(searchBox, '1');
    await sleep(1);
};

export const SearchNoMatch = Template.bind({});
SearchNoMatch.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // type in the search box
    const searchBox = canvas.getByTestId('models-list-search-box');
    userEvent.type(searchBox, 'something');
    await sleep(1);
};

export const SelectItem = Template.bind({});
SelectItem.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId('cardboard-list-item-models-list-1');
    userEvent.click(menu);
};

export const OpenItemMenu = Template.bind({});
OpenItemMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Finds the menu and opens it
    const menu = await canvas.findByTestId(
        'context-menu-models-list-1-moreMenu'
    );
    userEvent.click(menu);
};
