import React from 'react';
import { ComponentStory } from '@storybook/react';
import { CardboardList, ICardboardListProps } from './CardboardList';
import { CardboardListItemProps } from './CardboardListItem';
import { IContextualMenuItem } from '@fluentui/react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';

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
const defaultGetListItemPropsHandler = (
    item: IFakeListItem,
    index: number
): CardboardListItemProps<IFakeListItem> => {
    return {
        ariaLabel: '',
        isChecked: item.isChecked,
        iconStartName: index % 3 == 0 ? 'Shapes' : undefined,
        iconEndName: index % 4 == 0 ? 'Link' : undefined,
        onClick: defaultOnClickHandler,
        overflowMenuItems: index % 2 ? getDefaultMenuItems(item) : [],
        textPrimary: item.itemId + ' some extra text for overflow',
        textSecondary: item.itemDescription
    };
};

const defaultProps: ICardboardListProps<unknown> = {
    getListItemProps: defaultGetListItemPropsHandler as (
        item: unknown,
        index: number
    ) => CardboardListItemProps<unknown>,
    items: defaultListItems,
    listKey: 'testList'
};

type TemplateStory = ComponentStory<typeof CardboardList>;
const Template: TemplateStory = (args) => (
    <CardboardList<IFakeListItem>
        {...(args as ICardboardListProps<IFakeListItem>)}
    />
);

export const BasicList = Template.bind({}) as TemplateStory;
BasicList.args = defaultProps;

export const WithAllElements = Template.bind({}) as TemplateStory;
WithAllElements.args = {
    ...defaultProps,
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        textPrimary: (item as IFakeListItem).itemId,
        textSecondary: (item as IFakeListItem).itemDescription,
        iconStartName: 'Link',
        iconEndName: 'Shapes',
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
    })
};

export const WithMenu = Template.bind({}) as TemplateStory;
WithMenu.args = {
    ...defaultProps,
    getListItemProps: (item, index) => ({
        ariaLabel: '',
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
    })
};

export const WithStartAndEndIcon = Template.bind({}) as TemplateStory;
WithStartAndEndIcon.args = {
    ...defaultProps,
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Link',
        iconEndName: 'Shapes',
        onClick: defaultOnClickHandler,
        textPrimary: `List item ${index}`
    })
};

export const WithStartIconAndMenu = Template.bind({}) as TemplateStory;
WithStartIconAndMenu.args = {
    ...defaultProps,
    getListItemProps: (item, index) => ({
        ariaLabel: '',
        iconStartName: 'Link',
        textPrimary: `List item ${index}`,
        onClick: defaultOnClickHandler,
        overflowMenuItems: getDefaultMenuItems(item)
    })
};

export const WithHighlightedText = Template.bind({}) as TemplateStory;
WithHighlightedText.args = {
    ...defaultProps,
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
        iconStartName: 'Shapes',
        onClick: defaultOnClickHandler,
        textPrimary: (item as IFakeListItem).itemId,
        textSecondary: (item as IFakeListItem).itemDescription
    })
};
