import React from 'react';
import { ComponentStory } from '@storybook/react';
import { CardboardList, ICardboardListProps } from './CardboardList';
import BaseComponent from '../BaseComponent/BaseComponent';
import { ICardboardListItemProps } from './CardboardListItem';
import { IContextualMenuItem } from '@fluentui/react';

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
const Template: TemplateStory = (args, context) => {
    return (
        <div style={cardStyle}>
            <BaseComponent
                isLoading={false}
                theme={context.parameters.theme || context.globals.theme}
                locale={context.globals.locale}
                localeStrings={context.globals.locale}
            >
                <CardboardList<IFakeListItem>
                    getListItemProps={defaultGetListItemPropsHandler}
                    items={defaultListItems}
                    key="testList"
                    onClick={defaultOnClickHandler}
                    textToHighlight={''}
                    {...(args as ICardboardListProps<IFakeListItem>)}
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
