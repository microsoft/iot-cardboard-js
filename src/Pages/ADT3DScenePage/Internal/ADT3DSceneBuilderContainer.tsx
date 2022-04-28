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

export const ADT3DSceneBuilderContainer: React.FC<IADT3DSceneBuilderProps> = ({
    scenesConfig,
    sceneId,
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
                sceneId={sceneId}
                scenesConfig={scenesConfig}
            />
            <FloatingScenePageModeToggle
                sceneId={sceneId}
                handleScenePageModeChange={handleScenePageModeChange}
                selectedMode={deeplinkState.mode}
            />
        </BaseComponent>
    );
};
const SceneContents: React.FC<ISceneContentsProps> = (props) => {
    const { adapter, mode, refetchConfig, scenesConfig, sceneId } = props;
    switch (mode) {
        case ADT3DScenePageModes.BuildScene:
            return (
                <div className="cb-scene-page-scene-builder-wrapper">
                    <ADT3DSceneBuilder adapter={adapter} sceneId={sceneId} />
                </div>
            );
        case ADT3DScenePageModes.ViewScene:
            return (
                <div className="cb-scene-view-viewer">
                    <ADT3DViewer
                        adapter={adapter}
                        pollingInterval={10000}
                        sceneId={sceneId}
                        scenesConfig={scenesConfig}
                        refetchConfig={refetchConfig}
                    />
                </div>
            );
    }
};
