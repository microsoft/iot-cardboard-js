import { cleanup } from '@testing-library/react';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import { IExpressionRangeVisual } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { BehaviorFormContextReducer } from './BehaviorFormContext';
import { GET_MOCK_BEHAVIOR_FORM_STATE } from './BehaviorFormContext.mock';
import {
    BehaviorFormContextAction,
    BehaviorFormContextActionType
} from './BehaviorFormContext.types';

describe('BehaviorFormContext', () => {
    afterEach(cleanup);
    describe('Actions', () => {
        describe('Alerts', () => {
            const getAlertVisual = (
                expression: string
            ): IExpressionRangeVisual => {
                return {
                    expressionType: 'CategoricalValues',
                    objectIDs: { expression: '' },
                    type: 'ExpressionRangeVisual',
                    valueExpression: expression,
                    valueRanges: []
                };
            };

            test('adds the alert to the list of visuals when no alert exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.visuals = []; // no visuals

                const alertExpression = 'myProperty > 1';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                    payload: {
                        visual: getAlertVisual(alertExpression)
                    }
                };

                expect(
                    initialState.behaviorToEdit.visuals.filter(
                        ViewerConfigUtility.isAlertVisual
                    ).length
                ).toEqual(0); // mock data should NOT have an alert

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const alerts = result.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isAlertVisual
                );
                expect(alerts.length).toEqual(1);
                expect(alerts[0].valueExpression).toEqual(alertExpression);
            });

            test('updates the alert in the list of visuals when an alert already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.visuals = [
                    getAlertVisual('some expression')
                ]; // add an alert to the list

                const alertExpression = 'myProperty > 1';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                    payload: {
                        visual: getAlertVisual(alertExpression)
                    }
                };

                expect(
                    initialState.behaviorToEdit.visuals.filter(
                        ViewerConfigUtility.isAlertVisual
                    ).length
                ).toEqual(1); // mock data should have a visual

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const alerts = result.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isAlertVisual
                );
                expect(alerts.length).toEqual(1);
                expect(alerts[0].valueExpression).toEqual(alertExpression);
            });
        });
    });
    // describe('Alert actions', () => {
    //     test('returns [] when null config', () => {
    //         // ARRANGE
    //         const {} = render(getContextProvider());

    //         // ACT
    //         const result = ViewerConfigUtility.getSceneVisualsInScene(
    //             config,
    //             sceneId,
    //             twinData
    //         );

    //         // ASSERT
    //         expect(result).toEqual([]);
    //     });
    // });
});
