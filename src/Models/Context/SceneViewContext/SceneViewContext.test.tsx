import { cleanup } from '@testing-library/react';
import { CustomMeshItem } from '../../Classes/SceneView.types';
import { SceneViewContextReducer } from './SceneViewContext';
import { GET_MOCK_SCENE_CONTROL_STATE } from './SceneViewContext.mock';
import {
    SceneViewContextAction,
    SceneViewContextActionType
} from './SceneViewContext.types';

describe('SceneViewContext', () => {
    afterEach(cleanup);
    describe('Actions', () => {
        test('Set outlined mesh items', () => {
            // Arrange
            const initialState = GET_MOCK_SCENE_CONTROL_STATE();
            initialState.outlinedMeshItems = [];
            const meshItems: CustomMeshItem[] = [
                {
                    meshId: 'MOCK_ID',
                    color: '#000'
                }
            ];

            const action: SceneViewContextAction = {
                payload: {
                    outlinedMeshItems: meshItems
                },
                type: SceneViewContextActionType.SET_OUTLINED_MESH_ITEMS
            };

            // Act
            const result = SceneViewContextReducer(initialState, action);

            // Assert
            expect(result.outlinedMeshItems.length).toEqual(1);
            expect(result.outlinedMeshItems[0].meshId).toEqual(
                meshItems[0].meshId
            );
            expect(result.outlinedMeshItems[0].color).toEqual(
                meshItems[0].color
            );
        });
    });
});
