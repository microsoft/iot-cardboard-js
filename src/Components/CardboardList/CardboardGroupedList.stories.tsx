import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { CardboardList } from './CardboardList';
import { IContextualMenuItem } from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import { ICardboardListProps } from './CardboardList.types';
import {
    ICardboardGroupedListItem,
    ICardboardGroupedListProps
} from './CardboardGroupedList.types';

const cardStyle = {
    height: '600px',
    width: '300px'
};
export default {
    title: 'Components/Lists/Grouped',
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

const getDefaultMenuItems = (
    item: ICardboardGroupedListItem<IFakeListItem>
): IContextualMenuItem[] => {
    return [
        {
            key: 'addToScene',
            id: `addToScene-${item.item.itemId}`,
            'data-testid': `addToScene-${item.item.itemId}`,
            text: 'Add to the scene',
            iconProps: {
                iconName: 'Add'
            },
            onClick: () => alert(`add ${item.item.itemId}`)
        }
    ];
};
const defaultOnClickHandler = (item) => {
    alert(`clicked item ${item.itemId}`);
};
const getListItem = (
    item: IFakeListItem,
    index: number
): ICardboardGroupedListItem<IFakeListItem> => {
    return {
        ariaLabel: '',
        iconStart: { name: 'Shapes' },
        item: item,
        onClick: defaultOnClickHandler,
        textPrimary: item.itemId + ' some extra text for overflow',
        textSecondary: item.itemDescription,
        itemType: index % 3 === 0 ? 'header' : 'item'
    };
};

const getDefaultItems = (): ICardboardGroupedListItem<IFakeListItem>[] =>
    defaultListItems.map((item, index) => getListItem(item, index));
const getDefaultProps = (): ICardboardGroupedListProps<unknown> => ({
    items: getDefaultItems(),
    listKey: 'testList'
});

type TemplateStory = ComponentStory<typeof CardboardList>;
const Template: TemplateStory = (args) => (
    <CardboardList<IFakeListItem>
        {...(args as ICardboardListProps<IFakeListItem>)}
    />
);

export const Base = Template.bind({}) as TemplateStory;
Base.args = getDefaultProps();

export const WithAllElements = Template.bind({}) as TemplateStory;
WithAllElements.args = {
    ...getDefaultProps(),
    items: getDefaultItems().map(
        (item, index) =>
            ({
                ...item,
                iconStart: { name: 'Link' },
                iconEnd: { name: 'Shapes' },
                isChecked: index % 2 === 0,
                overflowMenuItems: getDefaultMenuItems(item)
            } as ICardboardGroupedListItem<unknown>)
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
