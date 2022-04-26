import React, { useReducer } from 'react';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import ADT3DViewer from '../../../Components/ADT3DViewer/ADT3DViewer';
import ADT3DSceneBuilder from '../../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IADT3DSceneBuilderProps } from '../ADT3DScenePage.types';
import FloatingScenePageModeToggle from './FloatingScenePageModeToggle';
import { SET_ADT_SCENE_PAGE_MODE } from '../../../Models/Constants/ActionTypes';
import {
    ADT3DScenePageReducer,
    defaultADT3DScenePageState
} from '../ADT3DScenePage.state';

export const ADT3DSceneBuilderContainer: React.FC<IADT3DSceneBuilderProps> = ({
    mode = ADT3DScenePageModes.BuildScene,
    scenesConfig,
    scene,
    adapter,
    theme,
    locale,
    localeStrings,
    refetchConfig
}) => {
    const [state, dispatch] = useReducer(
        ADT3DScenePageReducer,
        defaultADT3DScenePageState
    );

    const handleScenePageModeChange = (
        newScenePageMode: ADT3DScenePageModes
    ) => {
        dispatch({
            type: SET_ADT_SCENE_PAGE_MODE,
            payload: newScenePageMode
        });
    };
    return (
        <BaseComponent
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            {mode === ADT3DScenePageModes.BuildScene ? (
                <div className="cb-scene-page-scene-builder-wrapper">
                    <ADT3DSceneBuilder
                        theme={theme}
                        locale={locale}
                        adapter={adapter}
                        sceneId={scene.id}
                    />
                </div>
            ) : (
                <div className="cb-scene-view-viewer">
                    <ADT3DViewer
                        adapter={adapter}
                        pollingInterval={10000}
                        sceneId={scene.id}
                        scenesConfig={scenesConfig}
                        refetchConfig={refetchConfig}
                    />
                </div>
            )}
            <FloatingScenePageModeToggle
                scene={scene}
                handleScenePageModeChange={handleScenePageModeChange}
                selectedMode={state.scenePageMode}
            />
        </BaseComponent>
    );
};
