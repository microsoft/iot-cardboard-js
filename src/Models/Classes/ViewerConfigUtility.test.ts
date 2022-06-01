import { cleanup } from '@testing-library/react-hooks';
import { DTwin } from '../Constants';
import { I3DScenesConfig } from '../Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from './ViewerConfigUtility';

// jest.mock('../../../i18n.ts', () => ({ t: () => 'testTranslation' }));

afterEach(cleanup);

describe('ViewerConfigUtility', () => {
    describe('Scene Visuals', () => {
        const MOCK_SCENE_ID = 'SceneId1';
        const getMockConfig = (): I3DScenesConfig => {
            return {
                $schema: {} as any,
                configuration: {
                    behaviors: [],
                    layers: [],
                    scenes: [
                        {
                            id: MOCK_SCENE_ID,
                            displayName: 'Mock display name',
                            behaviorIDs: [],
                            elements: [],
                            assets: []
                        }
                    ]
                }
            };
        };
        const getMockTwinData = (): Map<string, DTwin> => {
            return new Map<string, DTwin>();
        };

        test('returns [] when null config', () => {
            // ARRANGE
            const config = undefined;
            const sceneId = MOCK_SCENE_ID;
            const twinData = getMockTwinData();

            // ACT
            const result = ViewerConfigUtility.getSceneVisualsInScene(
                config,
                sceneId,
                twinData
            );

            // ASSERT
            expect(result).toEqual([]);
        });
        test('returns [] when empty sceneId', () => {
            // ARRANGE
            const config = getMockConfig();
            const sceneId = MOCK_SCENE_ID;
            const twinData = getMockTwinData();

            // ACT
            const result = ViewerConfigUtility.getSceneVisualsInScene(
                config,
                sceneId,
                twinData
            );

            // ASSERT
            expect(result).toEqual([]);
        });
        test('returns [] when empty twinData', () => {
            // ARRANGE
            const config = getMockConfig();
            const sceneId = MOCK_SCENE_ID;
            const twinData = new Map<string, DTwin>();

            // ACT
            const result = ViewerConfigUtility.getSceneVisualsInScene(
                config,
                sceneId,
                twinData
            );

            // ASSERT
            expect(result).toEqual([]);
        });
        test('returns visuals when valid inputs', () => {
            // ARRANGE
            const config = getMockConfig();
            const sceneId = MOCK_SCENE_ID;
            const twinData = getMockTwinData();

            // ACT
            const result = ViewerConfigUtility.getSceneVisualsInScene(
                config,
                sceneId,
                twinData
            );

            // ASSERT
            expect(result).not.toBeFalsy();
            expect(result).toEqual([]);
        });
    });
});
