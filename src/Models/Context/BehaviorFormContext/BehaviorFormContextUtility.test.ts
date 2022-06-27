import { cleanup } from '@testing-library/react';
import { defaultBehavior, VisualType } from '../../Classes/3DVConfig';
import ViewerConfigUtility from '../../Classes/ViewerConfigUtility';
import { IConsoleLogFunction } from '../../Constants';
import { deepCopy } from '../../Services/Utils';
import {
    IBehavior,
    IGaugeWidget,
    IPopoverVisual
} from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import { GET_MOCK_BEHAVIOR_FORM_STATE } from './BehaviorFormContext.mock';
import { IBehaviorFormContextState } from './BehaviorFormContext.types';
import {
    RemoveItemsFromListByFilter,
    RemoveWidgetFromBehaviorById,
    CreateNewBehavior,
    isStateDirty,
    AddOrUpdateListItemByFilter
} from './BehaviorFormContextUtility';

describe('BehaviorFormContextUtility', () => {
    let mockLogger: IConsoleLogFunction;
    const getBehavior = () => deepCopy(defaultBehavior);
    beforeEach(() => {
        mockLogger = jest.fn();
    });
    afterEach(() => {
        cleanup();
    });
    describe('isStateDirty', () => {
        let currentState: IBehaviorFormContextState;
        let initialBehavior: IBehavior;
        let initialLayers: string[];
        beforeEach(() => {
            initialBehavior = {
                ...defaultBehavior,
                displayName: 'initial name'
            };
            initialLayers = ['layer 1', 'layer 2'];

            currentState = GET_MOCK_BEHAVIOR_FORM_STATE();
            currentState.behaviorToEdit = deepCopy(initialBehavior);
            currentState.behaviorSelectedLayerIds = deepCopy(initialLayers);
        });
        test('should return false when neither behavior nor layers has changed', () => {
            // ARRANGE

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeFalsy();
        });
        test('should return true when behavior has a change', () => {
            // ARRANGE
            currentState.behaviorToEdit = {
                ...initialBehavior,
                displayName: 'something new' // change the name
            };

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when layers has a new entry', () => {
            // ARRANGE
            currentState.behaviorSelectedLayerIds = [
                ...initialLayers,
                'something new'
            ];

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when layers has removed an entry', () => {
            // ARRANGE
            currentState.behaviorSelectedLayerIds = [...initialLayers];
            currentState.behaviorSelectedLayerIds.pop();

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when layers is update to replace an entry', () => {
            // ARRANGE
            initialLayers.pop();
            currentState.behaviorSelectedLayerIds = [
                'new item',
                ...initialLayers
            ];

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when both layers and behavior are changed', () => {
            // ARRANGE
            initialLayers.pop();
            currentState.behaviorToEdit = {
                ...initialBehavior,
                displayName: 'something new'
            };

            // ACT
            const result = isStateDirty(
                currentState,
                initialBehavior,
                initialLayers,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
    });

    describe('Create New Behavior', () => {
        test('should have default values', () => {
            // ARRANGE

            // ACT
            const result = CreateNewBehavior();

            // ASSERT
            expect(result.id.length).toBeGreaterThan(0); // check the ID
            result.id = ''; // clear the id since it'll get a random value
            expect(JSON.stringify(result)).toEqual(
                JSON.stringify(defaultBehavior)
            );
        });
    });

    describe('RemoveWidgetFromBehaviorById', () => {
        const getPopover = (): IPopoverVisual => {
            return {
                objectIDs: { expression: '' },
                title: 'popover title',
                type: VisualType.Popover,
                widgets: []
            };
        };
        const getWidget = (id: string): IGaugeWidget => {
            return {
                id: id,
                type: 'Gauge',
                valueExpression: 'testExpression > 0',
                widgetConfiguration: {
                    label: 'widget label',
                    valueRanges: [
                        {
                            id: 'rangeId1',
                            values: [100, 150],
                            visual: {
                                color: 'blue'
                            }
                        }
                    ]
                }
            };
        };
        test('should silently pass when no popover visual exists on the behavior', () => {
            // ARRANGE
            const behavior = getBehavior();
            behavior.visuals = [];
            const widgetId = 'test id';

            // ACT
            RemoveWidgetFromBehaviorById(behavior, widgetId, mockLogger);

            // ASSERT
            const popoverVisuals = behavior.visuals.filter(
                ViewerConfigUtility.isPopoverVisual
            );
            expect(popoverVisuals.length).toEqual(0);
        });
        test('should silently pass when popover visual exists but has no widgets', () => {
            // ARRANGE
            const popover = getPopover();
            popover.widgets = [];

            const behavior = getBehavior();
            behavior.visuals = [popover];

            const widgetId = 'test id';

            // ACT
            RemoveWidgetFromBehaviorById(behavior, widgetId, mockLogger);

            // ASSERT
            const popoverVisuals = behavior.visuals.filter(
                ViewerConfigUtility.isPopoverVisual
            );
            expect(popoverVisuals?.length).toEqual(1);
            expect(popoverVisuals[0].widgets.length).toEqual(0);
        });
        test('should silently pass when popover visual exists with widgets but none that match the id provided', () => {
            // ARRANGE
            const popover = getPopover();
            popover.widgets = [getWidget('test widget 1')];

            const behavior = getBehavior();
            behavior.visuals = [popover];

            const widgetId = 'test id';

            // ACT
            RemoveWidgetFromBehaviorById(behavior, widgetId, mockLogger);

            // ASSERT
            const popoverVisuals = behavior.visuals.filter(
                ViewerConfigUtility.isPopoverVisual
            );
            expect(popoverVisuals?.length).toEqual(1);
            expect(popoverVisuals[0].widgets.length).toEqual(1);
        });
        test('should remove the widget with a matching id', () => {
            // ARRANGE
            const widgetId = 'test id';

            const popover = getPopover();
            popover.widgets = [getWidget('test widget 1'), getWidget(widgetId)];

            const behavior = getBehavior();
            behavior.visuals = [popover];

            // ACT
            RemoveWidgetFromBehaviorById(behavior, widgetId, mockLogger);

            // ASSERT
            const popoverVisuals = behavior.visuals.filter(
                ViewerConfigUtility.isPopoverVisual
            );
            expect(popoverVisuals?.length).toEqual(1);
            expect(popoverVisuals[0].widgets.length).toEqual(1);
        });
    });

    describe('RemoveItemsFromListByFilter', () => {
        interface ITestListItem {
            id: string;
            value: number;
        }

        test('null list does not throw any errors', () => {
            // ARRANGE
            const items = null;

            // ACT
            const result = RemoveItemsFromListByFilter(
                items,
                () => true,
                mockLogger
            );

            // ASSERT
            expect(result).toEqual([]);
        });
        test('no matches, returns false and does not change the list', () => {
            const items: ITestListItem[] = [
                { id: 'id1', value: 3 },
                { id: 'id2', value: 5 }
            ];

            // ACT
            const result = RemoveItemsFromListByFilter(
                items,
                (x: ITestListItem) => x.id === 'something else',
                mockLogger
            );

            // ASSERT
            expect(result.length).toEqual(2);
        });
        test('matched items are removed from the list', () => {
            // ARRANGE
            const items: ITestListItem[] = [
                { id: 'id1', value: 3 },
                { id: 'id2', value: 8 },
                { id: 'id3', value: 2 },
                { id: 'id4', value: 10 }
            ];

            // ACT
            const result = RemoveItemsFromListByFilter(
                items,
                (x: ITestListItem) => x.value > 4,
                mockLogger
            );

            // ASSERT
            expect(result.length).toEqual(2);
        });
    });

    describe('AddOrUpdateListItemByFilter', () => {
        interface ITestListItem {
            id: string;
            value: number;
        }
        test('null list of items does not throw any error', () => {
            // ARRANGE
            const items: ITestListItem[] = null;
            const item: ITestListItem = { id: 'testItem1', value: 5 };

            // ACT
            const result = AddOrUpdateListItemByFilter(
                items,
                item,
                (x: ITestListItem) => x.id === item.id,
                mockLogger
            );
            // ASSERT
            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual(item.id);
        });
        test('no matches, add the item to the list', () => {
            // ARRANGE
            const items: ITestListItem[] = [{ id: 'initial', value: 0 }];
            const item: ITestListItem = { id: 'testItem1', value: 5 };

            // ACT
            const result = AddOrUpdateListItemByFilter(
                items,
                item,
                (x: ITestListItem) => x.id === item.id,
                mockLogger
            );
            // ASSERT
            expect(result.length).toEqual(2);
            expect(result[1].id).toEqual(item.id);
        });
        test('match found, replaces the item', () => {
            // ARRANGE
            const item: ITestListItem = { id: 'testItem1', value: 5 };
            const items: ITestListItem[] = [
                { id: 'initial', value: 0 },
                deepCopy(item)
            ];
            item.value = 10;

            // ACT
            const result = AddOrUpdateListItemByFilter(
                items,
                item,
                (x: ITestListItem) => x.id === item.id,
                mockLogger
            );
            // ASSERT
            expect(result.length).toEqual(2);
            expect(result[1].value).toEqual(10);
        });
    });
});
