import React, { useCallback } from 'react';
import { ViewerObjectStyle } from '../../Models/Constants';
import { useSceneThemeContext } from '../../Models/Context/SceneThemeContext/SceneThemeContext';
import { SceneThemeContextActionType } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';
import ModelViewerModePicker from './ModelViewerModePicker';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface SceneThemePickerProps {}

const SceneThemePicker: React.FC<SceneThemePickerProps> = () => {
    const { sceneThemeDispatch, sceneThemeState } = useSceneThemeContext();
    const onChangeObjectColor = useCallback(
        (color: string) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_OBJECT_COLOR,
                payload: {
                    color: color
                }
            });
        },
        [sceneThemeDispatch]
    );
    const onChangeObjectStyle = useCallback(
        (style: ViewerObjectStyle) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_OBJECT_STYLE,
                payload: {
                    style: style
                }
            });
        },
        [sceneThemeDispatch]
    );
    const onChangeSceneBackground = useCallback(
        (color: string) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_SCENE_BACKGROUND,
                payload: {
                    color: color
                }
            });
        },
        [sceneThemeDispatch]
    );
    return (
        <ModelViewerModePicker
            selectedObjectColor={sceneThemeState.objectColor.color}
            selectedObjectStyle={sceneThemeState.objectStyle}
            selectedSceneBackground={sceneThemeState.sceneBackground.color}
            objectColorOptions={sceneThemeState.objectColorOptions}
            backgroundColorOptions={sceneThemeState.sceneBackgroundOptions}
            objectStyleOptions={sceneThemeState.objectStyleOptions}
            onChangeObjectColor={onChangeObjectColor}
            onChangeObjectStyle={onChangeObjectStyle}
            onChangeSceneBackground={onChangeSceneBackground}
        />
    );
};

export default SceneThemePicker;
