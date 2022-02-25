import React from 'react';
import { ComponentStory, ReactFramework, StoryContext } from '@storybook/react';
import BaseComponent from '../BaseComponent/BaseComponent';
import {
    CardboardListItem,
    ICardboardListItemPropsInternal
} from './CardboardListItem';
import { IContextualMenuItem } from '@fluentui/react';
import { waitForFirstRender } from '../../Models/Services/StoryUtilities';
import { userEvent, within } from '@storybook/testing-library';
import { Theme } from '../..';

type IStoryContext = StoryContext<
    ReactFramework,
    ICardboardListItemPropsInternal & {
        children?: React.ReactNode;
    }
>;
export default {
    title: 'Components/Lists/Items',
    component: CardboardListItem,
    decorators: [
        (Story, context: IStoryContext) => (
            <div style={cardStyle}>
                <BaseComponent
                    isLoading={false}
                    theme={context.parameters.theme || context.globals.theme}
                    locale={context.globals.locale}
                    localeStrings={context.globals.locale}
                >
                    <Story />
                </BaseComponent>
            </div>
        )
    ]
};

const cardStyle = {
    width: '300px',
    background: 'grey',
    padding: '15px'
};

const defaultProps: ICardboardListItemPropsInternal = {
    key: 'listItemKey',
    index: 0,
    onClick: () => alert('clicked'),
    ariaLabel: 'list item 1',
    textPrimary: 'primary text'
};

const defaultMenuItem: IContextualMenuItem = {
    key: 'addToScene',
    id: `addToScene-1`,
    'data-testid': `addToScene-1`,
    text: 'Add to the scene',
    iconProps: {
        iconName: 'Add'
    },
    onClick: () => alert(`add 1`)
};
const defaultMenuItems: IContextualMenuItem[] = [defaultMenuItem];

type TemplateStory = ComponentStory<typeof CardboardListItem>;
const Template: TemplateStory = (args) => {
    return <CardboardListItem {...args} />;
};

export const BasicItem = Template.bind({}) as TemplateStory;
BasicItem.args = defaultProps;

export const WithAllElements = Template.bind({}) as TemplateStory;
WithAllElements.args = {
    ...defaultProps,
    textSecondary: 'secondary text',
    iconStartName: 'Link',
    iconEndName: 'Shapes',
    overflowMenuItems: defaultMenuItems,
    isChecked: false
};

export const WithAllElementsLightHover = Template.bind({}) as TemplateStory;
WithAllElementsLightHover.args = WithAllElements.args;
WithAllElementsLightHover.parameters = {
    theme: Theme.Light,
    pseudo: { hover: true }
};

export const WithAllElementsLightFocus = Template.bind({}) as TemplateStory;
WithAllElementsLightFocus.args = WithAllElements.args;
WithAllElementsLightFocus.parameters = {
    theme: Theme.Light,
    pseudo: { focus: true }
};

export const WithAllElementsDark = Template.bind({}) as TemplateStory;
WithAllElementsDark.args = WithAllElements.args;
WithAllElementsDark.parameters = {
    theme: Theme.Dark
};

export const WithAllElementsDarkHover = Template.bind({}) as TemplateStory;
WithAllElementsDarkHover.args = WithAllElementsDark.args;
WithAllElementsDarkHover.parameters = {
    theme: Theme.Dark,
    pseudo: { hover: true }
};

export const WithAllElementsDarkFocus = Template.bind({}) as TemplateStory;
WithAllElementsDarkFocus.args = WithAllElementsDark.args;
WithAllElementsDarkFocus.parameters = {
    theme: Theme.Dark,
    pseudo: { focus: true }
};

export const WithMenu = Template.bind({}) as TemplateStory;
WithMenu.args = {
    ...defaultProps,
    overflowMenuItems: defaultMenuItems
};
export const WithMenuOpened = Template.bind({}) as TemplateStory;
WithMenuOpened.args = WithMenu.args;
WithMenuOpened.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    // Finds the menu and clicks it
    const menuItem = canvas.getByTestId(
        'cardboard-list-item-undefined-0-moreMenu'
    );
    await userEvent.click(menuItem);
};

export const WithStartIcon = Template.bind({}) as TemplateStory;
WithStartIcon.args = {
    ...defaultProps,
    iconStartName: 'Shapes'
};

export const WithEndIcon = Template.bind({}) as TemplateStory;
WithEndIcon.args = {
    ...defaultProps,
    iconEndName: 'Add'
};

export const WithStartAndEndIcon = Template.bind({}) as TemplateStory;
WithStartAndEndIcon.args = {
    ...WithStartIcon.args,
    ...WithEndIcon.args
};

export const WithStartIconAndMenu = Template.bind({}) as TemplateStory;
WithStartIconAndMenu.args = {
    ...WithStartIcon.args,
    ...WithMenu.args
};

export const WithSecondaryText = Template.bind({}) as TemplateStory;
WithSecondaryText.args = {
    ...defaultProps,
    textSecondary: 'secondary text goes here'
};

export const WithCheckboxUnchecked = Template.bind({}) as TemplateStory;
WithCheckboxUnchecked.args = {
    ...defaultProps,
    isChecked: false
};
export const WithCheckboxChecked = Template.bind({}) as TemplateStory;
WithCheckboxChecked.args = {
    ...defaultProps,
    isChecked: true
};

export const WithCheckboxAndSecondary = Template.bind({}) as TemplateStory;
WithCheckboxAndSecondary.args = {
    ...WithSecondaryText.args,
    ...WithCheckboxUnchecked.args
};

export const WithLongText = Template.bind({}) as TemplateStory;
WithLongText.args = {
    ...defaultProps,
    textPrimary:
        'really long text for all the items and it gets cut off by overflowing',
    textSecondary:
        'description can sometimes be really really long and we need it to overflow'
};

export const WithLongTextAndIcon = Template.bind({}) as TemplateStory;
WithLongTextAndIcon.args = {
    ...defaultProps,
    ...WithLongText.args,
    iconEndName: 'Shapes'
};

export const WithLongTextAndMenu = Template.bind({}) as TemplateStory;
WithLongTextAndMenu.args = {
    ...defaultProps,
    ...WithLongText.args,
    overflowMenuItems: defaultMenuItems
};

export const WithHighlightedText = Template.bind({}) as TemplateStory;
WithHighlightedText.args = {
    ...defaultProps,
    textToHighlight: 'prim'
};
