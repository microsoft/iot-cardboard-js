import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { CardboardList } from './CardboardList';
import { IContextualMenuItem } from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import { ICardboardListItem, ICardboardListProps } from './CardboardList.types';

const cardStyle = {
    height: '600px',
    width: '300px'
};
export default {
    title: 'Components/Lists',
    component: CardboardList,
    decorators: [
        getDefaultStoryDecorator<ICardboardListProps<IFakeListItem>>(cardStyle)
    ]
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
const getListItem = (
    item: IFakeListItem,
    index: number
): ICardboardListItem<IFakeListItem> => {
    return {
        ariaLabel: '',
        isChecked: item.isChecked,
        iconStart: index % 3 == 0 ? { name: 'Shapes' } : undefined,
        iconEnd: index % 4 == 0 ? { name: 'Link' } : undefined,
        item: item,
        onClick: defaultOnClickHandler,
        overflowMenuItems: index % 2 ? getDefaultMenuItems(item) : [],
        textPrimary: item.itemId + ' some extra text for overflow',
        textSecondary: item.itemDescription
    };
};

const getDefaultItems = (): ICardboardListItem<IFakeListItem>[] =>
    defaultListItems.map((item, index) => getListItem(item, index));
const getDefaultProps = (): ICardboardListProps<unknown> => ({
    items: getDefaultItems(),
    listKey: 'testList'
});

type TemplateStory = ComponentStory<typeof CardboardList>;
const Template: TemplateStory = (args) => (
    <CardboardList<IFakeListItem>
        {...(args as ICardboardListProps<IFakeListItem>)}
    />
);

export const BasicList = Template.bind({}) as TemplateStory;
BasicList.args = getDefaultProps();
BasicList.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-testList-1-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const WithSelectedItem = Template.bind({}) as TemplateStory;
WithSelectedItem.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                textPrimary: item.item.itemId,
                textSecondary: item.item.itemDescription,
                item: item,
                onClick: defaultOnClickHandler,
                isSelected: index === 2
            } as ICardboardListItem<unknown>)
    )
};

export const WithAllElements = Template.bind({}) as TemplateStory;
WithAllElements.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                textPrimary: item.item.itemId,
                textSecondary: item.item.itemDescription,
                iconStart: { name: 'Link' },
                iconEnd: { name: 'Shapes' },
                item: item,
                onClick: defaultOnClickHandler,
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
            } as ICardboardListItem<unknown>)
    )
};
WithAllElements.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-testList-1-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const WithMenu = Template.bind({}) as TemplateStory;
WithMenu.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                item: item,
                onClick: defaultOnClickHandler,
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
            } as ICardboardListItem<unknown>)
    )
};
WithMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-testList-0-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

export const WithStartAndEndIcon = Template.bind({}) as TemplateStory;
WithStartAndEndIcon.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                iconStart: { name: 'Link' },
                iconEnd: { name: 'Shapes' },
                item: item,
                onClick: defaultOnClickHandler,
                overflowMenuItems: undefined,
                textPrimary: `List item ${index}`
            } as ICardboardListItem<unknown>)
    )
};

export const WithStartIconAndMenu = Template.bind({}) as TemplateStory;
WithStartIconAndMenu.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                iconStart: { name: 'Link' },
                item: item,
                textPrimary: `List item ${index}`,
                onClick: defaultOnClickHandler,
                overflowMenuItems: getDefaultMenuItems(item)
            } as ICardboardListItem<unknown>)
    )
};
WithStartIconAndMenu.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // type in the search box
    const moreMenu = await canvas.findByTestId(
        'context-menu-testList-0-moreMenu'
    );
    await userEvent.click(moreMenu);
    await sleep(1);
};

const customItems: IFakeListItem[] = [
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
];
export const WithHighlightedText = Template.bind({}) as TemplateStory;
WithHighlightedText.args = {
    ...getDefaultProps(),
    items: customItems.map(
        (item) =>
            ({
                iconStart: { name: 'Shapes' },
                onClick: defaultOnClickHandler,
                textPrimary: item.itemId,
                textSecondary: item.itemDescription
            } as ICardboardListItem<unknown>)
    ),
    textToHighlight: 'rock'
};
