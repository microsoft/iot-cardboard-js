import { cleanup } from '@testing-library/react-hooks';
import { DTwin, PRIMARY_TWIN_NAME } from '../../Constants';
import { I3DScenesConfig } from '../../Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../ViewerConfigUtility';
import {
    ALIASED_TWIN_ID_1,
    ALIASED_TWIN_ID_2,
    CUSTOM_ELEMENT,
    getTwinWithInFlowOutFlow,
    getTwinWithInFlowPercentFull,
    getTwinWithTemperature,
    MOCK_BEHAVIOR_1,
    MOCK_BEHAVIOR_2,
    MOCK_BEHAVIOR_3,
    MOCK_ELEMENT_1,
    MOCK_ELEMENT_2,
    MOCK_ELEMENT_3_WITH_ALIASES
} from './ViewerConfigUtilityTestHelpers';

afterEach(cleanup);

describe('ViewerConfigUtility', () => {
    describe('Scene Visuals', () => {
        const MOCK_SCENE_ID = 'SceneId1';
        /**
         * Has 3 behaviors, only 2 are used in the scene (1,2)
         * Has 3 elements, 2 are real and one is custom so we should ignore it
         * @returns mock data for the default scene
         */
        const getMockConfig = (): I3DScenesConfig => {
            return {
                $schema: {} as any,
                configuration: {
                    behaviors: [
                        MOCK_BEHAVIOR_1,
                        MOCK_BEHAVIOR_2,
                        MOCK_BEHAVIOR_3
                    ],
                    layers: [],
                    scenes: [
                        {
                            id: MOCK_SCENE_ID,
                            displayName: 'Mock display name',
                            behaviorIDs: [
                                MOCK_BEHAVIOR_1.id,
                                MOCK_BEHAVIOR_2.id
                            ],
                            elements: [
                                MOCK_ELEMENT_1,
                                MOCK_ELEMENT_3_WITH_ALIASES,
                                CUSTOM_ELEMENT
                            ],
                            assets: []
                        }
                    ]
                }
            };
        };
        /** create twin data for 3 elements, the 3rd has aliases which get data for the same properties as element 1 */
        const getMockTwinData = (): Map<string, DTwin> => {
            const data = new Map<string, DTwin>();
            data.set(
                MOCK_ELEMENT_1.primaryTwinID,
                getTwinWithInFlowOutFlow(MOCK_ELEMENT_1.primaryTwinID)
            );
            data.set(
                MOCK_ELEMENT_2.primaryTwinID,
                getTwinWithInFlowPercentFull(MOCK_ELEMENT_2.primaryTwinID)
            );
            data.set(
                MOCK_ELEMENT_3_WITH_ALIASES.primaryTwinID,
                getTwinWithTemperature(
                    MOCK_ELEMENT_3_WITH_ALIASES.primaryTwinID
                )
            );
            data.set(
                ALIASED_TWIN_ID_1,
                getTwinWithInFlowOutFlow(ALIASED_TWIN_ID_1)
            );
            data.set(
                ALIASED_TWIN_ID_2,
                getTwinWithInFlowOutFlow(ALIASED_TWIN_ID_1)
            );

            return data;
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
            const sceneId = undefined;
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
        test('returns [] when scene not found', () => {
            // ARRANGE
            const config = getMockConfig();
            const sceneId = 'Some scene id that does not exist';
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
            expect(result.length).toEqual(2); // cause 2 real elements, skips the custom
            expect(result).toMatchSnapshot(); // validate the full output

            // validate Visual 1
            const visual1 = result[0];
            expect(visual1.behaviors.length).toEqual(2); // first element should have 2 behaviors
            expect(
                visual1.behaviors.find((x) => x.id === MOCK_BEHAVIOR_1.id)
            ).toBeTruthy();
            expect(
                visual1.behaviors.find((x) => x.id === MOCK_BEHAVIOR_2.id)
            ).toBeTruthy();
            expect(visual1.coloredMeshItems).toBeUndefined(); // not populated by the helper
            expect(visual1.twins).not.toBeUndefined();
            expect(Object.keys(visual1.twins).length).toEqual(1);
            expect(visual1.twins[PRIMARY_TWIN_NAME]).not.toBeUndefined();

            // validate Visual 2
            const visual2 = result[1];
            expect(visual2.behaviors.length).toEqual(1); // second element has 2 other behaviors
            expect(
                visual2.behaviors.find((x) => x.id === MOCK_BEHAVIOR_2.id)
            ).toBeTruthy();
            expect(visual2.coloredMeshItems).toBeUndefined(); // not populated by the helper
            expect(visual2.twins).not.toBeUndefined();
            expect(Object.keys(visual2.twins).length).toEqual(3);
            expect(visual2.twins[PRIMARY_TWIN_NAME]).not.toBeUndefined();
            expect(visual2.twins['TestAlias1']).not.toBeUndefined(); // should resolve the aliases
            expect(visual2.twins['TestAlias2']).not.toBeUndefined(); // should resolve the aliases
        });
        test('returns visuals even when no elements are part of behaviors (ie. no twin data)', () => {
            // ARRANGE
            const config = getMockConfig();
            const sceneId = MOCK_SCENE_ID;
            const twinData = new Map<string, DTwin>();

            // remove all elements from behaviors just to simulate the real thing (shouldn't actually matter)
            const behaviorIds = config.configuration.scenes.find(
                (x) => x.id === sceneId
            ).behaviorIDs;
            config.configuration.behaviors
                .filter((x) => behaviorIds.includes(x.id))
                .forEach((x) => (x.datasources = []));

            // ACT
            const result = ViewerConfigUtility.getSceneVisualsInScene(
                config,
                sceneId,
                twinData
            );

            // ASSERT
            expect(result).not.toBeFalsy();
            expect(result.length).toEqual(2); // cause 2 real elements, skips the custom
            expect(result).toMatchSnapshot(); // validate the full output
        });
    });
});
