import { cleanup } from '@testing-library/react';
import ViewerConfigUtility from '../../../../../../Models/Classes/ViewerConfigUtility';
import {
    IElementTwinToObjectMappingDataSource,
    IExpressionRangeVisual
} from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
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

            test('[Add/Update] - adds the alert to the list of visuals when no alert exists', () => {
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

            test('[Add/Update] - updates the alert in the list of visuals when an alert already exists', () => {
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

            test('[Remove] - silently passes when trying to remove an alert when there is none on the behavior', () => {
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

            test('[Remove] - removes the alert in the list of visuals if an alert already exists', () => {
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
            test('[Add/Update] - adds the alias to the list of twins when no alias exists', () => {
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

            test('[Add/Update] - adds the alias in the list of twins when an alias already exists with a different name', () => {
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

            test('[Add/Update] - silently passes when an alias already exists with the same name', () => {
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

            test('[Remove] - silently passes when trying to remove an alias when there is none on the behavior', () => {
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

            test('[Remove] - removes the alias in the list of twins when it exists', () => {
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

        describe('Data sources', () => {
            const getDataSource = (
                elementIds: string[]
            ): IElementTwinToObjectMappingDataSource => {
                return {
                    elementIDs: elementIds,
                    type: 'ElementTwinToObjectMappingDataSource'
                };
            };

            test('[Add/Update] - adds the dataSource to the list of data sources when no dataSource exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.datasources = []; // no items

                const elementIds = ['id1', 'id2'];
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE,
                    payload: {
                        source: getDataSource(elementIds)
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const dataSources = result.behaviorToEdit.datasources.filter(
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                );
                expect(dataSources.length).toEqual(1);
                expect(dataSources[0].elementIDs.length).toEqual(
                    elementIds.length
                );
                expect(dataSources[0].elementIDs[0]).toEqual(elementIds[0]);
            });

            test('[Add/Update] - updates the dataSource in the list of data sources when a matching dataSource already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.datasources = [
                    getDataSource(['mine'])
                ]; // existing data

                const elementIds = ['id1', 'id2'];
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_ADD_OR_UPDATE,
                    payload: {
                        source: getDataSource(elementIds)
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const dataSources = result.behaviorToEdit.datasources.filter(
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                );
                expect(dataSources.length).toEqual(1);
                expect(dataSources[0].elementIDs.length).toEqual(
                    elementIds.length
                );
                expect(dataSources[0].elementIDs[0]).toEqual(elementIds[0]);
            });

            test('[Remove] - silently passes when trying to remove an dataSource when there is none on the behavior', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.datasources = []; // no data

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const dataSources = result.behaviorToEdit.datasources.filter(
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                );
                expect(dataSources.length).toEqual(0);
            });

            test('[Remove] - removes the dataSource in the list of data sources if a dataSource already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.datasources = [
                    getDataSource(['my id'])
                ]; // has data

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_DATA_SOURCE_REMOVE
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const dataSources = result.behaviorToEdit.datasources.filter(
                    ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                );
                expect(dataSources.length).toEqual(0);
            });
        });

        describe('Display name', () => {
            test('should set display name to provided value', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorToEdit.displayName = 'some initial value';

                const name = 'new name';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET,
                    payload: {
                        name: name
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                expect(result.behaviorToEdit.displayName).toEqual(name);
            });
        });

        describe('Layers', () => {
            test('[Add/Update] - adds the layer to the list of layers when no layer exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorSelectedLayerIds = []; // no items

                const layerId = 'id1';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD,
                    payload: {
                        layerId: layerId
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const layers = result.behaviorSelectedLayerIds.filter(
                    (x) => x === layerId
                );
                expect(result.behaviorSelectedLayerIds.length).toEqual(1);
                expect(layers.length).toEqual(1);
            });

            test('[Add/Update] - updates the layer in the list of layers when a matching layer already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                const layerId = 'id1';
                initialState.behaviorSelectedLayerIds = [
                    layerId,
                    'something else'
                ]; // existing data

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD,
                    payload: {
                        layerId: layerId
                    }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const layers = result.behaviorSelectedLayerIds.filter(
                    (x) => x === layerId
                );
                expect(result.behaviorSelectedLayerIds.length).toEqual(2);
                expect(layers.length).toEqual(1);
            });

            test('[Remove] - silently passes when trying to remove an layer when there is none in the list', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                initialState.behaviorSelectedLayerIds = []; // no data

                const layerId = 'id1';
                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE,
                    payload: { layerId }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const layers = result.behaviorSelectedLayerIds.filter(
                    (x) => x === layerId
                );
                expect(result.behaviorSelectedLayerIds.length).toEqual(0);
                expect(layers.length).toEqual(0);
            });

            test('[Remove] - removes the layer in the list of layers if a layer already exists', () => {
                // ARRANGE
                const initialState = GET_MOCK_BEHAVIOR_FORM_STATE();
                const layerId = 'id1';
                initialState.behaviorSelectedLayerIds = [
                    layerId,
                    'something else'
                ]; // has data

                const action: BehaviorFormContextAction = {
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE,
                    payload: { layerId }
                };

                // ACT
                const result = BehaviorFormContextReducer(initialState, action);

                // ASSERT
                const layers = result.behaviorSelectedLayerIds.filter(
                    (x) => x === layerId
                );
                expect(result.behaviorSelectedLayerIds.length).toEqual(1);
                expect(layers.length).toEqual(0);
            });
        });
    });
});
