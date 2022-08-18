/** File for exporting common testing utilities for the context */

import { ADT3DScenePageModes } from '../../Constants';
import { IDeeplinkContextState } from './DeeplinkContext.types';

export const GET_MOCK_DEEPLINK_STATE = (): IDeeplinkContextState => ({
    adtUrl: 'https://myurl.adt-0',
    mode: ADT3DScenePageModes.BuildScene,
    sceneId: 'scene id-0',
    selectedElementId: 'some element-0',
    selectedLayerIds: ['someLayerId-0'],
    storageContainerUrl: 'https://storageContainerUrl-0'
});
