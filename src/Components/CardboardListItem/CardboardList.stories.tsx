import React from 'react';
import { ComponentStory } from '@storybook/react';
// import { userEvent, within } from '@storybook/testing-library';
// import MockAdapter from '../../Adapters/MockAdapter';
// import {
//     clickOverFlowMenuItem,
//     findDialogMenuItem,
//     findOverflowMenuItem,
//     sleep,
//     waitForFirstRender
// } from '../../../Utilities';
import { CardboardList, ICardboardListProps } from './CardboardList';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ICardboardListItemProps } from './CardboardListItem';
import { IContextualMenuItem } from '@fluentui/react';
import { waitForFirstRender } from '../../Models/Services/StoryUtilities';
import { userEvent, within } from '@storybook/testing-library';

export default {
    title: 'Components/Lists'
};

const cardStyle = {
    height: '600px',
    width: '300px'
};

interface IFakeListItem {
    itemId: string;
    itemDescription: string | undefined;
    isChecked: boolean | undefined;
}
const defaultListItems: IFakeListItem[] = [
    {
        itemId: 'item 1',
        itemDescription: 'description for item 1',
        isChecked: false
    },
    {
        itemId: 'item 2',
        itemDescription: 'description for item 1',
        isChecked: true
    },
    {
        itemId: 'item 3',
        itemDescription: 'description for item 3',
        isChecked: undefined
    },
    {
        itemId: 'item 4',
        itemDescription: 'description for item 4',
        isChecked: true
    },
    {
        itemId: 'item 5',
        itemDescription: 'description for item 5',
        isChecked: false
    }
];

const getDefaultMenuItems = (item): IContextualMenuItem[] => {
    return [
        {
            key: 'addToScene',
            id: `addToScene-${item.id}`,
            'data-testid': `addToScene-${item.id}`,
            text: 'Add to the scene',
            iconProps: {
                iconName: 'Add'
            },
            onClick: () => alert(`add ${item.id}`)
        }
    ];
};
const defaultOnClickHandler = (item) => {
    alert(`clicked item ${item.itemId}`);
};
const defaultGetListItemPropsHandler = (
    item: IFakeListItem,
    index: number
): ICardboardListItemProps => {
    return {
        ariaLabel: '',
        isChecked: item.isChecked,
        iconStartName: index % 3 == 0 ? 'Shapes' : undefined,
        iconEndName: index % 4 == 0 ? 'Link' : undefined,
        overflowMenuItems: index % 2 ? getDefaultMenuItems(item) : [],
        textPrimary: item.itemId + ' some extra text for overflow',
        textSecondary: item.itemDescription
    };
};

type TemplateStory = ComponentStory<typeof CardboardList>;
const Template: TemplateStory = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={cardStyle}>
            <BaseComponent
                isLoading={false}
                theme={theme}
                locale={locale}
                localeStrings={locale}
            >
                <CardboardList<IFakeListItem>
                    getListItemProps={defaultGetListItemPropsHandler}
                    items={defaultListItems}
                    key="testList"
                    onClick={defaultOnClickHandler}
                    textToHighlight={''}
                    {...(_args as ICardboardListProps<IFakeListItem>)}
                />
            </BaseComponent>
        </div>
    );
};

export const BasicList = Template.bind({}) as TemplateStory;
BasicList.args = {};

export const WithAllElements = Template.bind({}) as TemplateStory;
WithAllElements.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        textPrimary: (item as IFakeListItem).itemId,
        textSecondary: (item as IFakeListItem).itemDescription,
        iconStartName: 'Link',
        iconEndName: 'Shapes',
        overflowMenuItems: [
            {
                key: 'key1',
                text: 'key 1',
                iconProps: {
                    iconName: 'Shapes'
                }
            }
        ],
        isChecked: index % 2 === 0
    })
};

export const WithMenu = Template.bind({}) as TemplateStory;
WithMenu.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        overflowMenuItems: [
            {
                key: 'item 1',
                text: 'item 1',
                iconProps: {
                    iconName: 'Shapes'
                }
            }
        ],
        textPrimary: `List item ${index}`
    })
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
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Shapes',
        textPrimary: `List item ${index}`
    })
};

export const WithEndIcon = Template.bind({}) as TemplateStory;
WithEndIcon.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconEndName: 'Add',
        textPrimary: `List item ${index}`
    })
};

export const WithStartAndEndIcon = Template.bind({}) as TemplateStory;
WithStartAndEndIcon.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Link',
        iconEndName: 'Shapes',
        textPrimary: `List item ${index}`
    })
};

export const WithStartIconAndMenu = Template.bind({}) as TemplateStory;
WithStartIconAndMenu.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Link',
        textPrimary: `List item ${index}`,
        overflowMenuItems: getDefaultMenuItems(item)
    })
};

export const WithSecondaryText = Template.bind({}) as TemplateStory;
WithSecondaryText.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Link',
        textPrimary: `List item ${index}`,
        textSecondary: `Description of item ${index}`
    })
};

export const WithCheckbox = Template.bind({}) as TemplateStory;
WithCheckbox.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        textPrimary: `List item ${index}`,
        isChecked: index % 2 === 0
    })
};

export const WithCheckboxAndSecondary = Template.bind({}) as TemplateStory;
WithCheckboxAndSecondary.args = {
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        textPrimary: `List item ${index}`,
        textSecondary: `description for ${index}`,
        isChecked: index % 2 === 0
    })
};

export const WithLongText = Template.bind({}) as TemplateStory;
WithLongText.args = {
    items: [
        {
            isChecked: undefined,
            itemId: 'really long text for all the items',
            itemDescription:
                'description can sometimes be really really long and we need it to overflow'
        }
    ],
    getListItemProps: (item, _index) => ({
        ariaLabel: '',
        textPrimary: (item as IFakeListItem).itemId,
        textSecondary: (item as IFakeListItem).itemDescription,
        overflowMenuItems: [
            {
                key: 'key1'
            }
        ],
        isChecked: (item as IFakeListItem).isChecked
    })
};

export const WithHighlightedText = Template.bind({}) as TemplateStory;
WithHighlightedText.args = {
    items: [
        {
            itemId: 'rock 1'
        } as IFakeListItem,
        {
            itemId: 'stream 1'
        } as IFakeListItem,
        {
            itemId: 'stream 2'
        } as IFakeListItem,
        {
            itemId: 'rock 2'
        } as IFakeListItem
    ],
    textToHighlight: 'rock',
    getListItemProps: (item, _index) => ({
        ariaLabel: '',
        textPrimary: (item as IFakeListItem).itemId,
        textSecondary: (item as IFakeListItem).itemDescription,
        iconStartName: 'Shapes'
    })
};
