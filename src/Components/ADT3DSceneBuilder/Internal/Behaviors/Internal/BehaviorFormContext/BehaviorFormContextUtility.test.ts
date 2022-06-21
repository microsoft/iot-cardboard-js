import { cleanup } from '@testing-library/react';
import { defaultBehavior } from '../../../../../../Models/Classes/3DVConfig';
import { deepCopy } from '../../../../../../Models/Services/Utils';
import { IBehavior } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { GET_MOCK_BEHAVIOR_FORM_STATE } from './BehaviorFormContext.mock';
import { IBehaviorFormContextState } from './BehaviorFormContext.types';
import { isStateDirty } from './BehaviorFormContextUtility';

describe('BehaviorFormContextUtility', () => {
    afterEach(cleanup);
    const mockLogger = () => undefined;
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
});
