import React from 'react';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';
import { ADT3DScenePageModes } from '../../../Models/Constants/Enums';
import ADT3DViewer from '../../../Components/ADT3DViewer/ADT3DViewer';
import ADT3DSceneBuilder from '../../../Components/ADT3DSceneBuilder/ADT3DSceneBuilder';
import { IADT3DSceneBuilderProps } from '../ADT3DScenePage.types';

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
                        sceneConfig={scenesConfig}
                        refetchConfig={refetchConfig}
                    />
                </div>
            )}
        </BaseComponent>
    );
};
