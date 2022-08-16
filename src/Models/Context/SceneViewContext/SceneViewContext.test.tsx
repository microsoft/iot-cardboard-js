/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { cleanup } from '@testing-library/react';
import { DatasourceType } from '../../Classes/3DVConfig';
import { CustomMeshItem } from '../../Classes/SceneView.types';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneViewContextReducer } from './SceneViewContext';
import { GET_MOCK_SCENE_CONTROL_STATE } from './SceneViewContext.mock';
import {
    SceneViewContextAction,
    SceneViewContextActionType
} from './SceneViewContext.types';

const MOCK_COLOR = '#000';

describe('SceneViewContext', () => {
    afterEach(cleanup);
    describe('Actions', () => {
        test('Reset outlined mesh items', () => {
            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const meshItems: CustomMeshItem[] = [
                {
                    meshId: 'MOCK_ID',
                    color: MOCK_COLOR
                }
            ];

            // Reset with a value
            let action: SceneViewContextAction = {
                payload: {
                    outlinedMeshItems: meshItems
                },
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES
            };

            // Act
            let result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(1);
            expect(result.outlinedMeshItems![0].meshId).toEqual(
                meshItems[0].meshId
            );
            expect(result.outlinedMeshItems![0].color).toEqual(
                meshItems[0].color
            );

            // Reset with no value
            action = {
                type: SceneViewContextActionType.RESET_OUTLINED_MESHES
            };

            // Act
            result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(0);
        });

        test('Reset selected (outline + fill) mesh items', () => {
            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const action: SceneViewContextAction = {
                type: SceneViewContextActionType.RESET_SELECTED_MESHES
            };

            // Act
            const result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(0);
            // Todo: Enable when colored is included
            // expect(result.coloredMeshItems!.length).toEqual(0);
        });

        test('Set outlined meshes from ids', () => {
            const MOCK_MESH_IDS = ['MOCK_ID'];

            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const action: SceneViewContextAction = {
                type: SceneViewContextActionType.SET_SCENE_OUTLINED_MESHES,
                payload: {
                    meshIds: MOCK_MESH_IDS,
                    color: MOCK_COLOR
                }
            };

            // Act
            const result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(1);
            expect(result.outlinedMeshItems![0].meshId).toEqual(
                MOCK_MESH_IDS[0]
            );
            expect(result.outlinedMeshItems![0].color).toEqual(MOCK_COLOR);
        });

        // TODO: Enable this when colored meshes are included in this pattern
        // test('Set selected items (outline + fill) from ids', () => {
        //     const MOCK_MESH_IDS = ['MOCK_ID'];

        //     // Arrange
        //     const initialState = GET_MOCK_SCENE_CONTROL_STATE();
        //     initialState.outlinedMeshItems = [];
        //     const action: SceneViewContextAction = {
        //         type: SceneViewContextActionType.SET_SCENE_SELECTED_MESHES,
        //         payload: {
        //             meshIds: MOCK_MESH_IDS,
        //             color: MOCK_COLOR
        //         }
        //     };

        //     // Act
        //     const result = SceneViewContextReducer(initialState, action);

        //     // Assert
        //     expect(result.outlinedMeshItems!.length).toEqual(1);
        //     expect(result.outlinedMeshItems![0].meshId).toEqual(
        //         MOCK_MESH_IDS[0]
        //     );
        //     expect(result.outlinedMeshItems![0].color).toEqual(MOCK_COLOR);
        //     expect(result.coloredMeshItems!.length).toEqual(1);
        //     expect(result.coloredMeshItems![0].meshId).toEqual(
        //         MOCK_MESH_IDS[0]
        //     );
        //     expect(result.coloredMeshItems![0].color).toEqual(MOCK_COLOR);
        // });

        test('Outline behavior meshes', () => {
            const MOCK_BEHAVIOR: IBehavior = {
                id: 'MOCK_BEHAVIOR_ID',
                displayName: 'MOCK_BEHAVIOR_NAME',
                visuals: [],
                datasources: [
                    {
                        type:
                            DatasourceType.ElementTwinToObjectMappingDataSource,
                        elementIDs: ['MOCK_ELEMENT_ID']
                    }
                ]
            };
            const MOCK_ELEMENT: ITwinToObjectMapping = {
                type: 'TwinToObjectMapping',
                displayName: 'MOCK_DISPLAY_NAME',
                id: 'MOCK_ELEMENT_ID',
                objectIDs: ['MOCK_MESH_ID'],
                primaryTwinID: 'MOCK_PRIMARY_TWIN_ID'
            };

            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const action: SceneViewContextAction = {
                type: SceneViewContextActionType.OUTLINE_BEHAVIOR_MESHES,
                payload: {
                    behavior: MOCK_BEHAVIOR,
                    elements: [MOCK_ELEMENT],
                    color: MOCK_COLOR
                }
            };

            // Act
            const result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(1);
            expect(result.outlinedMeshItems![0].meshId).toEqual('MOCK_MESH_ID');
            expect(result.outlinedMeshItems![0].color).toEqual(MOCK_COLOR);
        });

        test('Outline element meshes', () => {
            const MOCK_ELEMENT: ITwinToObjectMapping = {
                type: 'TwinToObjectMapping',
                displayName: 'MOCK_DISPLAY_NAME',
                id: 'MOCK_ELEMENT_ID',
                objectIDs: ['MOCK_MESH_ID'],
                primaryTwinID: 'MOCK_PRIMARY_TWIN_ID'
            };
            const MESH_ID = 'MOCK_MESH_ID';

            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const action: SceneViewContextAction = {
                type: SceneViewContextActionType.OUTLINE_ELEMENT_MESHES,
                payload: {
                    elements: [MOCK_ELEMENT],
                    meshId: MESH_ID,
                    color: MOCK_COLOR
                }
            };

            // Act
            const result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems!.length).toEqual(1);
            expect(result.outlinedMeshItems![0].meshId).toEqual('MOCK_MESH_ID');
            expect(result.outlinedMeshItems![0].color).toEqual(MOCK_COLOR);
        });
    });
});
