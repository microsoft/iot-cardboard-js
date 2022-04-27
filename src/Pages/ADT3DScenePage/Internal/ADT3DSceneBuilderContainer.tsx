import React from 'react';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import ADT3DViewer from '../../../Components/ADT3DViewer/ADT3DViewer';
import ADT3DSceneBuilder from '../../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import {
    IADT3DSceneBuilderProps,
    ISceneContentsProps
} from '../ADT3DScenePage.types';
import FloatingScenePageModeToggle from './FloatingScenePageModeToggle';
import {
    DeeplinkContextActionType,
    useDeeplinkContext
} from '../../../Contexts/3DSceneDeeplinkContext';
import ADT3DGlobeContainer from '../../../Components/ADT3DGlobeContainer/ADT3DGlobeContainer';
import {
    I3DScenesConfig,
    IScene
} from '../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADTandBlobAdapter, MockAdapter } from '../../../Adapters';

export const ADT3DSceneBuilderContainer: React.FC<IADT3DSceneBuilderProps> = ({
    scenesConfig,
    scene,
    adapter,
    theme,
    locale,
    localeStrings,
    refetchConfig
}) => {
    const {
        state: deeplinkState,
        dispatch: deeplinkDispatch
    } = useDeeplinkContext();

    const handleScenePageModeChange = (
        newScenePageMode: ADT3DScenePageModes
    ) => {
        deeplinkDispatch({
            type: DeeplinkContextActionType.SET_MODE,
            payload: {
                mode: newScenePageMode
            }
        });
    };
    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            <SceneContents
                adapter={adapter}
                mode={deeplinkState.mode}
                refetchConfig={refetchConfig}
                scene={scene}
                scenesConfig={scenesConfig}
            />
            <FloatingScenePageModeToggle
                scene={scene}
                handleScenePageModeChange={handleScenePageModeChange}
                selectedMode={deeplinkState.mode}
            />
        </BaseComponent>
    );
};
const SceneContents: React.FC<ISceneContentsProps> = (props) => {
    const { adapter, mode, refetchConfig, scenesConfig, scene } = props;
    switch (mode) {
        case ADT3DScenePageModes.BuildScene:
            return (
                <div className="cb-scene-page-scene-builder-wrapper">
                    <ADT3DSceneBuilder adapter={adapter} sceneId={scene.id} />
                </div>
            );
        case ADT3DScenePageModes.ViewScene:
            return (
                <div className="cb-scene-view-viewer">
                    <ADT3DViewer
                        adapter={adapter}
                        pollingInterval={10000}
                        sceneId={scene.id}
                        scenesConfig={scenesConfig}
                        refetchConfig={refetchConfig}
                    />
                </div>
            );
        default:
            return (
                <div className="cb-scene-page-scene-globe-container">
                    <ADT3DGlobeContainer
                        adapter={adapter as ADTandBlobAdapter}
                    />
                </div>
            );
    }
};
