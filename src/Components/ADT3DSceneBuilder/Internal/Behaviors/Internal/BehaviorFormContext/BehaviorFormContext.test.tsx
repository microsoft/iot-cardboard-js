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

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const alerts = result.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isAlertVisual
                );
                expect(alerts.length).toEqual(1);
                expect(alerts[0].valueExpression).toEqual(alertExpression);
            });

            test('silently passes when trying to remove an alert when there is none on the behavior', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.visuals = [];

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const alerts = result.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isAlertVisual
                );
                expect(alerts.length).toEqual(0);
            });

            test('removes the alert in the list of visuals if an alert already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.visuals = [
                    getAlertVisual('some expression')
                ]; // add an alert to the list

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const alerts = result.behaviorToEdit.visuals.filter(
                    ViewerConfigUtility.isAlertVisual
                );
                expect(alerts.length).toEqual(0);
            });
        });

        describe('Aliases', () => {
            test('adds the alias to the list of twins when no alias exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.twinAliases = [];

                const aliasName = 'myTwinAlias';
                const action: BehaviorFormContextAction = {
                    type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD,
                    payload: {
                        alias: aliasName
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const allAliases = result.behaviorToEdit.twinAliases;
                expect(allAliases.length).toEqual(1);
                const matchingAliases = allAliases.filter(
                    (x) => x === aliasName
                );
                expect(matchingAliases.length).toEqual(1);
            });

            test('adds the alias in the list of twins when an alias already exists with a different name', () => {
                // ARRANGE

                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.twinAliases = ['some other alias'];

                const aliasName = 'myTwinAlias';
                const action: BehaviorFormContextAction = {
                    type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD,
                    payload: {
                        alias: aliasName
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const allAliases = result.behaviorToEdit.twinAliases;
                expect(allAliases.length).toEqual(2);
                const matchingAliases = allAliases.filter(
                    (x) => x === aliasName
                );
                expect(matchingAliases.length).toEqual(1);
            });

            test('silently passes when an alias already exists with the same name', () => {
                // ARRANGE
                const aliasName = 'myTwinAlias';

                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.twinAliases = [aliasName];

                const action: BehaviorFormContextAction = {
                    type: BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_ADD,
                    payload: {
                        alias: aliasName
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const allAliases = result.behaviorToEdit.twinAliases;
                expect(allAliases.length).toEqual(1);
                const matchingAliases = allAliases.filter(
                    (x) => x === aliasName
                );
                expect(matchingAliases.length).toEqual(1);
            });

            test('silently passes when trying to remove an alias when there is none on the behavior', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.twinAliases = [];

                const aliasName = 'myAlias';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE,
                    payload: {
                        alias: aliasName
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const allAliases = result.behaviorToEdit.twinAliases;
                expect(allAliases.length).toEqual(0);
            });

            test('removes the alias in the list of twins when it exists', () => {
                // ARRANGE
                const aliasName = 'myAlias';
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.twinAliases = [
                    aliasName,
                    'something else'
                ];

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALIAS_REMOVE,
                    payload: {
                        alias: aliasName
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const allAliases = result.behaviorToEdit.twinAliases;
                expect(allAliases.length).toEqual(1);
                const matchingAliases = allAliases.filter(
                    (x) => x === aliasName
                );
                expect(matchingAliases.length).toEqual(0);
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
