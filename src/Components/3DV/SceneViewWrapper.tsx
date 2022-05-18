/*

This class intercepts calls to the SceneViewer and enables AddIns to hook into events

*/

import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { ICameraPosition } from '../../Models/Classes/SceneView.types';
import SceneView, { showFpsCounter } from './SceneView';
import {
    ADT3DAddInEventTypes,
    CameraInteraction,
    ViewerModeStyles
} from '../../Models/Constants/Enums';
import {
    ADT3DAddInEventData,
    ISceneViewWrapperProps
} from '../../Models/Constants/Interfaces';
import ModelViewerModePicker, {
    ViewerMode
} from '../ModelViewerModePicker/ModelViewerModePicker';
import './SceneView.scss';
import {
    DefaultViewerModeObjectColor,
    IADT3DViewerMode,
    IADTBackgroundColor,
    IADTObjectColor,
    SelectedCameraInteractionKey,
    ViewerModeBackgroundColors,
    ViewerModeObjectColors,
    ViewerThemeKey
} from '../../Models/Constants';
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

const getClassNames = classNamesFunction<
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
>();

const SceneViewWrapper: React.FC<ISceneViewWrapperProps> = (props) => {
    const {
        adapter,
        addInProps,
        config,
        hideViewModePickerUI,
        objectColorUpdated,
        sceneId,
        sceneViewProps,
        sceneVisuals,
        selectedVisual,
        styles,
        wrapperMode
    } = props;
    const { onMeshHover, onMeshClick, onSceneLoaded, ...svp } = sceneViewProps;

    const data = new ADT3DAddInEventData();
    data.adapter = adapter;
    data.config = config;
    data.sceneId = sceneId;
    data.sceneVisuals = sceneVisuals;
    const [
        selectedViewerMode,
        setSelectedViewerMode
    ] = useState<IADT3DViewerMode>(null);

    const [
        cameraInteractionType,
        setCameraInteractionType
    ] = useState<CameraInteraction>(null);

    const sceneViewComponent = useRef();

    const theme = useTheme();
    const classNames = getClassNames(styles, { theme, mode: wrapperMode });

    useEffect(() => {
        const cameraInteraction = localStorage.getItem(
            SelectedCameraInteractionKey
        );
        if (cameraInteraction) {
            setCameraInteractionType(JSON.parse(cameraInteraction));
        } else {
            setCameraInteractionType(CameraInteraction.Rotate);
        }

        const viewerMode = localStorage.getItem(ViewerThemeKey);
        if (viewerMode) {
            setSelectedViewerMode(JSON.parse(viewerMode));
        } else {
            setSelectedViewerMode({
                objectColor: null,
                style: ViewerModeStyles.Default,
                isWireframe: false,
                background: ViewerModeBackgroundColors[0]
            });
        }
    }, []);

    useEffect(() => {
        if (selectedViewerMode) {
            localStorage.setItem(
                ViewerThemeKey,
                JSON.stringify(selectedViewerMode)
            );
        }
    }, [selectedViewerMode]);

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

    const onViewerModeUpdated = (viewerMode: ViewerMode) => {
        if (viewerMode) {
            let objectColor: IADTObjectColor = null;
            if (viewerMode.objectColor) {
                objectColor = ViewerModeObjectColors.find(
                    (oc) => viewerMode?.objectColor === oc.color
                );
            }

            if (!objectColor) {
                objectColor = DefaultViewerModeObjectColor;
            }

            let backgroundColor: IADTBackgroundColor = null;
            if (viewerMode.background) {
                backgroundColor = ViewerModeBackgroundColors.find(
                    (bc) => viewerMode?.background === bc.color
                );
            }

            const isWireframe =
                viewerMode.style === ViewerModeStyles.Wireframe ? true : false;

            setSelectedViewerMode({
                objectColor: objectColor,
                background: backgroundColor,
                style: viewerMode.style,
                isWireframe: isWireframe
            });

            if (objectColorUpdated) {
                objectColorUpdated(objectColor);
            }
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

    return (
        <div
            style={
                selectedViewerMode?.background?.color
                    ? {
                          background: selectedViewerMode.background.color
                      }
                    : {}
            }
            className={css('cb-sceneview-wrapper ', classNames.root)}
        >
            <SceneView
                ref={sceneViewComponent}
                isWireframe={selectedViewerMode?.isWireframe}
                objectColors={selectedViewerMode?.objectColor}
                backgroundColor={selectedViewerMode?.background}
                onCameraMove={addInProps?.onCameraMove ? cameraMove : undefined}
                {...svp}
                onMeshHover={meshHover}
                onMeshClick={meshClick}
                onSceneLoaded={sceneLoaded}
                cameraInteractionType={cameraInteractionType}
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
            <Stack
                horizontal
                styles={classNames.subComponentStyles.rightHeaderControlsStack}
            >
                {!hideViewModePickerUI && (
                    <ModelViewerModePicker
                        defaultViewerMode={{
                            objectColor: selectedViewerMode?.objectColor?.color,
                            style: selectedViewerMode?.style,
                            background: selectedViewerMode?.background?.color
                        }}
                        viewerModeUpdated={onViewerModeUpdated}
                        objectColors={ViewerModeObjectColors}
                        backgroundColors={ViewerModeBackgroundColors}
                    />
                )}
            </Stack>
        </div>
    );
};

export default styled<
    ISceneViewWrapperProps,
    ISceneViewWrapperStyleProps,
    ISceneViewWrapperStyles
>(SceneViewWrapper, getStyles);
