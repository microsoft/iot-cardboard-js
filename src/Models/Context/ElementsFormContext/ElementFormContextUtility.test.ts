import { cleanup } from '@testing-library/react';
import { getDefaultElement } from '../../Classes/3DVConfig';
import { IConsoleLogFunction } from '../../Constants';
import { deepCopy } from '../../Services/Utils';
import { ITwinToObjectMapping } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import { GET_MOCK_ELEMENT_FORM_STATE } from './ElementFormContext.mock';
import { IElementFormContextState } from './ElementFormContext.types';
import { isStateDirty } from './ElementFormContextUtility';

describe('ElementFormContextUtility', () => {
    let mockLogger: IConsoleLogFunction;
    beforeEach(() => {
        mockLogger = jest.fn();
    });
    afterEach(() => {
        cleanup();
    });
    describe('isStateDirty', () => {
        let currentState: IElementFormContextState;
        let initialElement: ITwinToObjectMapping;
        let initialBehaviors: string[];
        beforeEach(() => {
            initialElement = getDefaultElement({
                displayName: 'initial name'
            });
            initialBehaviors = ['layer 1', 'layer 2'];

            currentState = GET_MOCK_ELEMENT_FORM_STATE();
            currentState.elementToEdit = deepCopy(initialElement);
            currentState.linkedBehaviorIds = deepCopy(initialBehaviors);
        });
        test('should return false when neither element nor layers has changed', () => {
            // ARRANGE

            // ACT
            const result = isStateDirty(
                currentState,
                initialElement,
                initialBehaviors,
                mockLogger
            );

            // ASSERT
            expect(result).toBeFalsy();
        });
        test('should return true when element has a change', () => {
            // ARRANGE
            currentState.elementToEdit = {
                ...initialElement,
                displayName: 'something new' // change the name
            };

            // ACT
            const result = isStateDirty(
                currentState,
                initialElement,
                initialBehaviors,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when behaviors list has a new entry', () => {
            // ARRANGE
            currentState.linkedBehaviorIds = [
                ...initialBehaviors,
                'something new'
            ];

            // ACT
            const result = isStateDirty(
                currentState,
                initialElement,
                initialBehaviors,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when behaviors list has removed an entry', () => {
            // ARRANGE
            currentState.linkedBehaviorIds = [...initialBehaviors];
            currentState.linkedBehaviorIds.pop();

            // ACT
            const result = isStateDirty(
                currentState,
                initialElement,
                initialBehaviors,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
        test('should return true when both layers and element are changed', () => {
            // ARRANGE
            initialBehaviors.pop();
            currentState.elementToEdit = {
                ...initialElement,
                displayName: 'something new'
            };

            // ACT
            const result = isStateDirty(
                currentState,
                initialElement,
                initialBehaviors,
                mockLogger
            );

            // ASSERT
            expect(result).toBeTruthy();
        });
    });
});
