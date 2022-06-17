import React from 'react';
import { DirectionalHint } from '@fluentui/react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { ICardboardListItem } from '../CardboardList/CardboardList.types';
import CardboardListCallout from './CardboardListCallout';
import { useId } from '@fluentui/react-hooks';

interface IFakeCardboardListItem {
    itemId: string;
    itemDescription: string | undefined;
}

interface TestComponentProps {
    onPrimaryActionClick: (searchTerm) => void;
}

describe('CardboardListCallout', () => {
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

    const getDefaultCardboardListItems = (): Array<
        ICardboardListItem<IFakeCardboardListItem>
    > =>
        defaultCardboardListItems.map((item) => ({
            ariaLabel: '',
            iconStart: { name: 'Shapes' },
            iconEnd: { name: 'Add' },
            item: item,
            onClick: defaultOnClickHandler,
            textPrimary: item.itemId,
            textSecondary: item.itemDescription
        }));

    const TestComponent: React.FC<TestComponentProps> = ({
        onPrimaryActionClick
    }) => {
        const testCalloutTargetId = useId('test-cardboard-list-callout-target');

        return (
            <CardboardListCallout
                title="Test cardboard list callout"
                listKey="testList"
                directionalHint={DirectionalHint.bottomLeftEdge}
                filterPlaceholder="Search"
                noResultText="No result"
                listType="Complex"
                listItems={getDefaultCardboardListItems() as any}
                filterPredicate={(fakeItem, searchTerm) =>
                    (fakeItem as IFakeCardboardListItem).itemId
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                }
                calloutTarget={testCalloutTargetId}
                onDismiss={() => {
                    console.log('Dismissed');
                }}
                primaryActionProps={{
                    primaryActionLabel: 'Create',
                    onPrimaryActionClick: onPrimaryActionClick
                }}
                dataButtonTestId="create-item-callout-button"
                searchBoxDataTestId="search-box"
                focusTrapTestId="focus-trap"
            />
        );
    };

    test('entered search term passed successfully on primary button click', async () => {
        // setup a DOM element as a render target
        const testCallback = jest.fn();
        const { getByTestId } = render(
            <TestComponent onPrimaryActionClick={testCallback} />
        );

        const modalComponent = screen.getByTestId('focus-trap'); // take the snapshot of the callout modal component with search text
        expect(modalComponent).toMatchSnapshot();

        const searchTerm = 'test';
        const searchBox = getByTestId('search-box');
        fireEvent.change(searchBox, { target: { value: searchTerm } }); // emulate the user typing input

        const createNewButton = getByTestId('create-item-callout-button'); // click on the primary button in the callout
        await waitFor(() => user.click(createNewButton));

        expect(testCallback).toHaveBeenCalledWith(searchTerm); // test if the search term is successfully passed to the on primary button click event handler method through component's callback
    });
});
