import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    getDefaultStoryDecorator,
    sleep
} from '../../Models/Services/StoryUtilities';
import { ICardboardListCalloutProps } from './CardboardListCallout.types';
import CardboardListCallout from './CardboardListCallout';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import { ActionButton, DirectionalHint } from '@fluentui/react';
import { useBoolean, useId } from '@fluentui/react-hooks';

const componentStyle = {
    height: '600px',
    width: '300px'
};

export default {
    title: 'Components/CardboardListCallout',
    component: CardboardListCallout,
    decorators: [
        getDefaultStoryDecorator<ICardboardListCalloutProps<string>>(
            componentStyle
        )
    ]
};

// fake data to be used for either CardboardList or CardboardBasicList
const defaultCardboardBasicListItems = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
];
interface IFakeCardboardListItem {
    itemId: string;
    itemDescription: string | undefined;
}
const defaultCardboardListItems: IFakeCardboardListItem[] = [
    {
        itemId: 'Item 1',
        itemDescription: 'description for item 1'
    },
    {
        itemId: 'Item 2',
        itemDescription: 'description for item 1'
    },
    {
        itemId: 'Item 3',
        itemDescription: 'description for item 3'
    },
    {
        itemId: 'Item 4',
        itemDescription: 'description for item 4'
    },
    {
        itemId: 'Item 5',
        itemDescription: 'description for item 5'
    }
];

const defaultOnClickHandler = (item) => {
    alert(`clicked item ${item.itemId}`);
};

const getDefaultCardboardListItems = (): ICardboardListItem<IFakeCardboardListItem>[] =>
    defaultCardboardListItems.map((item) => ({
        ariaLabel: '',
        iconStart: { name: 'Shapes' },
        iconEnd: { name: 'Add' },
        item: item,
        onClick: defaultOnClickHandler,
        textPrimary: item.itemId,
        textSecondary: item.itemDescription
    }));

const getCommonDefaultProps = (): Partial<ICardboardListCalloutProps> => ({
    title: 'Example title',
    listKey: 'testList',
    directionalHint: DirectionalHint.bottomLeftEdge,
    filterPlaceholder: 'Search',
    noResultText: 'No result'
});

type TemplateStory = ComponentStory<typeof CardboardListCallout>;
const Template = (args) => {
    const testCalloutTargetId = useId('test-cardboard-list-callout-target');
    const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(
        false
    );

    return (
        <>
            <ActionButton
                data-testid="showCalloutButton"
                id={testCalloutTargetId}
                text="Show list callout"
                onClick={toggleIsCalloutVisible}
            />
            {isCalloutVisible && (
                <CardboardListCallout
                    {...args}
                    calloutTarget={testCalloutTargetId}
                    onDismiss={toggleIsCalloutVisible}
                />
            )}
        </>
    );
};

export const ExampleCardboardListCallout = Template.bind({}) as TemplateStory;
ExampleCardboardListCallout.args = {
    ...getCommonDefaultProps(),
    listType: 'Complex',
    listItems: getDefaultCardboardListItems(),
    filterPredicate: (fakeItem: IFakeCardboardListItem, searchTerm) =>
        fakeItem.itemId.toLowerCase().includes(searchTerm.toLowerCase())
};
ExampleCardboardListCallout.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // click on target to show callout
    const showCalloutButton = await canvas.findByTestId('showCalloutButton');
    await userEvent.click(showCalloutButton);

    // wait until callout show animation to complete
    await sleep(500);
};

export const ExampleCardboardListCalloutWithPrimaryButton = Template.bind(
    {}
) as TemplateStory;
ExampleCardboardListCalloutWithPrimaryButton.args = {
    ...getCommonDefaultProps(),
    listType: 'Complex',
    listItems: getDefaultCardboardListItems(),
    filterPredicate: (fakeItem: IFakeCardboardListItem, searchTerm) =>
        fakeItem.itemId.toLowerCase().includes(searchTerm.toLowerCase()),
    primaryActionProps: {
        primaryActionLabel: 'Create',
        onPrimaryActionClick: () => {
            console.log('Primary action button clicked!');
        }
    }
};
ExampleCardboardListCalloutWithPrimaryButton.play = async ({
    canvasElement
}) => {
    const canvas = within(canvasElement);

    // click on target to show callout
    const showCalloutButton = await canvas.findByTestId('showCalloutButton');
    await userEvent.click(showCalloutButton);

    // wait until callout show animation to complete
    await sleep(500);
};

export const ExampleCardboardBasicListCallout = Template.bind(
    {}
) as TemplateStory;
ExampleCardboardBasicListCallout.args = {
    ...getCommonDefaultProps(),
    listType: 'Basic',
    listItems: defaultCardboardBasicListItems,
    filterPredicate: (fakeItem: string, searchTerm) =>
        fakeItem.toLowerCase().includes(searchTerm.toLowerCase())
};
ExampleCardboardBasicListCallout.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // click on target to show callout
    const showCalloutButton = await canvas.findByTestId('showCalloutButton');
    await userEvent.click(showCalloutButton);

    // wait until callout show animation to complete
    await sleep(500);
};

export const ExampleCardboardBasicListCalloutWithPrimaryButton = Template.bind(
    {}
) as TemplateStory;
ExampleCardboardBasicListCalloutWithPrimaryButton.args = {
    ...getCommonDefaultProps(),
    listType: 'Basic',
    listItems: defaultCardboardBasicListItems,
    filterPredicate: (fakeItem: string, searchTerm) =>
        fakeItem.toLowerCase().includes(searchTerm.toLowerCase()),
    primaryActionProps: {
        primaryActionLabel: 'Create',
        onPrimaryActionClick: () => {
            console.log('Primary action button clicked!');
        }
    }
};
ExampleCardboardBasicListCalloutWithPrimaryButton.play = async ({
    canvasElement
}) => {
    const canvas = within(canvasElement);

    // click on target to show callout
    const showCalloutButton = await canvas.findByTestId('showCalloutButton');
    await userEvent.click(showCalloutButton);

    // wait until callout show animation to complete
    await sleep(500);
};
