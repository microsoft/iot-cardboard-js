import React, { useEffect, useRef } from 'react';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import ADT3DViewer from '../../../Components/ADT3DViewer/ADT3DViewer';
import ADT3DSceneBuilder from '../../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IADT3DSceneBuilderProps } from '../ADT3DScenePage.types';
import { ISceneViewProps } from '../../../Models/Classes/SceneView.types';

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
    const cameraPositionRef = useRef(null);
    const svp: ISceneViewProps = {
        cameraPosition: cameraPositionRef.current,
        onCameraMove: (position) => {
            cameraPositionRef.current = position;
        }
    };

    useEffect(() => {
        if (mode === ADT3DScenePageModes.ViewScene) {
            // Shift SceneView over a bit to maintain camera position
            const root = document.getRootNode() as Element;
            const sceneViewWrapper = root.getElementsByClassName(
                'cb-sceneview-wrapper'
            )?.[0] as HTMLDivElement;
            if (sceneViewWrapper) {
                sceneViewWrapper.className = 'cb-sceneview-wrapper-wide';
            }
        }
    }, [mode]);

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
                        sceneViewProps={svp}
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
                        sceneViewProps={svp}
                    />
                </div>
            )}
        </BaseComponent>
    );
};
