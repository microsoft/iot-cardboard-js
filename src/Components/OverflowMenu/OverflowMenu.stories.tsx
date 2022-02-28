import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    getDefaultStoryDecorator,
    sleep,
    waitForFirstRender
} from '../../Models/Services/StoryUtilities';
import { userEvent, within } from '@storybook/testing-library';
import { Theme } from '../..';
import { IOverflowMenuProps, OverflowMenu } from './OverflowMenu';

const cardStyle = {
    background: 'grey',
    width: '100px',
    padding: '15px'
};
export default {
    title: 'Components/OverflowMenu',
    component: OverflowMenu,
    decorators: [getDefaultStoryDecorator<IOverflowMenuProps>(cardStyle)]
};

const defaultProps: IOverflowMenuProps = {
    ariaLabel: 'list item 1',
    index: 0,
    menuKey: 'myList',
    menuProps: {
        items: [
            {
                key: 'item 1',
                text: 'item 1',
                onClick: () => alert('clicked item 1')
            },
            {
                key: 'item 2',
                text: 'item 2',
                iconProps: {
                    iconName: 'Shapes'
                },
                onClick: () => alert('clicked item 2')
            },
            {
                key: 'item 3',
                text: 'item 3',
                iconProps: {
                    iconName: 'Add'
                },
                onClick: () => alert('clicked item 3')
            }
        ]
    }
};

type TemplateStory = ComponentStory<typeof OverflowMenu>;
const Template: TemplateStory = (args) => {
    return <OverflowMenu {...args} />;
};

export const BasicItem = Template.bind({}) as TemplateStory;
BasicItem.args = defaultProps;

export const BasicItemDark = Template.bind({}) as TemplateStory;
BasicItemDark.args = BasicItem.args;
BasicItemDark.parameters = {
    theme: Theme.Dark
};

export const MenuOpened = Template.bind({}) as TemplateStory;
MenuOpened.args = defaultProps;
MenuOpened.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the menu and clicks it
    const menuItem = canvas.getByTestId('context-menu-myList-0-moreMenu');
    await userEvent.click(menuItem);
    await sleep(1000);
};

export const MenuOpenedDark = Template.bind({}) as TemplateStory;
MenuOpenedDark.args = MenuOpened.args;
MenuOpenedDark.play = MenuOpened.play;
MenuOpenedDark.parameters = {
    theme: Theme.Dark
};
