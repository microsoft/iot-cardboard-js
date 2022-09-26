/*

This class intercepts calls to the SceneViewer and enables AddIns to hook into events

*/

import React, { useContext, useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { ICameraPosition } from '../../Models/Classes/SceneView.types';
import SceneView, { showFpsCounter } from './SceneView';
import {
    ADT3DAddInEventTypes,
    CameraInteraction
} from '../../Models/Constants/Enums';
import {
    ADT3DAddInEventData,
    ISceneViewWrapperProps
} from '../../Models/Constants/Interfaces';
import './SceneView.scss';
import { SelectedCameraInteractionKey } from '../../Models/Constants';
import { CameraControls } from './Internal/CameraControls/CameraControls';
import {
    classNamesFunction,
    css,
    Stack,
    styled,
    useTheme
} from '@fluentui/react';
import { getStyles } from './SceneViewWrapper.styles';
import {
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
} from './SceneViewWrapper.types';
import { useSceneThemeContext } from '../../Models/Context/SceneThemeContext/SceneThemeContext';
import { WrapperMode } from './SceneView.types';
import { SceneViewContext } from '../../Models/Context/SceneViewContext/SceneViewContext';

const getClassNames = classNamesFunction<
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
>();

const SceneViewWrapper: React.FC<ISceneViewWrapperProps> = (props) => {
    const {
        adapter,
        addInProps,
        config,
        objectColorUpdated,
        sceneId,
        sceneViewProps,
        sceneVisuals,
        selectedVisual,
        styles,
        wrapperMode,
        getGroupedMeshes
    } = props;
    const { onMeshHover, onMeshClick, onSceneLoaded, ...svp } = sceneViewProps;

    const data = new ADT3DAddInEventData();
    data.adapter = adapter;
    data.config = config;
    data.sceneId = sceneId;
    data.sceneVisuals = sceneVisuals;

    const [
        cameraInteractionType,
        setCameraInteractionType
    ] = useState<CameraInteraction>(null);

    const sceneViewComponent = useRef();

    const theme = useTheme();
    const classNames = getClassNames(styles, { theme, mode: wrapperMode });

    const { sceneThemeState } = useSceneThemeContext();
    const { sceneViewState } = useContext(SceneViewContext);

    // notify consumer of the change
    useEffect(() => {
        if (objectColorUpdated) {
            objectColorUpdated(sceneThemeState.objectColor);
        }
    }, [objectColorUpdated, sceneThemeState.objectColor]);

    useEffect(() => {
        const cameraInteraction = localStorage.getItem(
            SelectedCameraInteractionKey
        );
        if (cameraInteraction) {
            setCameraInteractionType(JSON.parse(cameraInteraction));
        } else {
            setCameraInteractionType(CameraInteraction.Rotate);
        }
    }, []);

    const sceneLoaded = (scene: BABYLON.Scene) => {
        data.eventType = ADT3DAddInEventTypes.SceneLoaded;
        data.scene = scene;
        let noBubble = false;
        if (addInProps?.onSceneLoaded) {
            noBubble = addInProps.onSceneLoaded(data);
        }

        if (!noBubble && onSceneLoaded) {
            onSceneLoaded(scene);
        }
    };

    const meshHover = (
        mesh: BABYLON.AbstractMesh,
        scene: BABYLON.Scene,
        pointerEvent: PointerEvent
    ) => {
        data.mesh = mesh;
        data.scene = scene;
        data.pointerEvent = pointerEvent;
        let noBubble = false;
        if (addInProps?.onMeshHover) {
            noBubble = addInProps.onMeshHover(data);
        }

        if (!noBubble && onMeshHover) {
            onMeshHover(mesh, scene, pointerEvent);
        }
    };

    const meshClick = (
        mesh: BABYLON.AbstractMesh,
        scene: BABYLON.Scene,
        pointerEvent: PointerEvent
    ) => {
        data.mesh = mesh;
        data.scene = scene;
        data.pointerEvent = pointerEvent;
        let noBubble = false;
        if (addInProps?.onMeshClick) {
            noBubble = addInProps.onMeshClick(data);
        }

        if (!noBubble && onMeshClick) {
            onMeshClick(mesh, scene, pointerEvent);
        }
    };

    const cameraMove = (position: ICameraPosition) => {
        if (addInProps?.onCameraMove) {
            addInProps.onCameraMove(position);
        }
    };

    const onCameraInteractionChanged = (type) => {
        setCameraInteractionType(type);
        localStorage.setItem(
            SelectedCameraInteractionKey,
            JSON.stringify(type)
        );
    };

    const FPSCounterStyle = {
        position: 'absolute',
        display: 'flex',
        bottom: 0,
        right: 0
    } as const;

    const wrapperClassName =
        wrapperMode === WrapperMode.Builder
            ? 'cb-sceneview-builder-wrapper'
            : 'cb-sceneview-viewer-wrapper';
    return (
        <div
            style={
                sceneThemeState.sceneBackground
                    ? {
                          background: sceneThemeState.sceneBackground.color
                      }
                    : {}
            }
            className={css(wrapperClassName, classNames.root)}
        >
            <SceneView
                ref={sceneViewComponent}
                backgroundColor={sceneThemeState.sceneBackground}
                objectColor={sceneThemeState.objectColor}
                objectColorOptions={sceneThemeState.objectColorOptions}
                objectStyle={sceneThemeState.objectStyle}
                onCameraMove={addInProps?.onCameraMove ? cameraMove : undefined}
                {...svp}
                outlinedMeshitems={sceneViewState.outlinedMeshItems}
                cameraInteractionType={cameraInteractionType}
                onMeshClick={meshClick}
                onMeshHover={meshHover}
                onSceneLoaded={sceneLoaded}
                getGroupedMeshes={getGroupedMeshes}
            />
            {showFpsCounter && (
                <label id="FPS" style={FPSCounterStyle}>
                    FPS:
                </label>
            )}
            <Stack
                horizontal
                styles={classNames.subComponentStyles.cameraControlsStack}
            >
                <CameraControls
                    cameraInteraction={cameraInteractionType}
                    onCameraInteractionChanged={onCameraInteractionChanged}
                    onCameraZoom={(zoom) =>
                        (sceneViewComponent.current as any)?.zoomCamera(zoom)
                    }
                    onResetCamera={() =>
                        (sceneViewComponent.current as any)?.resetCamera(
                            selectedVisual?.element?.objectIDs
                        )
                    }
                />
            </Stack>
        </div>
    );
};

export default styled<
    ISceneViewWrapperProps,
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
>(SceneViewWrapper, getStyles);
