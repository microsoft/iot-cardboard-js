/*

This class intercepts calls to the SceneViewer and enables AddIns to hook into events

*/

import React, { useRef, useState } from 'react';
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { Marker } from '../../Models/Classes/SceneView.types';
import SceneView from './SceneView';
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
    ViewerModeBackgroundColors,
    ViewerModeObjectColors
} from '../../Models/Constants';
import { CameraControls } from './CameraControls';
import {
    memoizeFunction,
    mergeStyleSets,
    Theme,
    useTheme
} from '@fluentui/react';

export const SceneViewWrapper: React.FC<ISceneViewWrapperProps> = ({
    config,
    sceneId,
    adapter,
    sceneViewProps,
    sceneVisuals,
    addInProps,
    objectColorUpdated,
    hideViewModePickerUI
}) => {
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
    const styles = getStyles(theme);

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
        marker: Marker,
        mesh: BABYLON.AbstractMesh,
        scene: BABYLON.Scene,
        pointerEvent: PointerEvent
    ) => {
        data.eventType = ADT3DAddInEventTypes.MarkerHover;
        data.marker = marker;
        data.mesh = mesh;
        data.scene = scene;
        data.pointerEvent = pointerEvent;
        let noBubble = false;
        if (addInProps?.onMeshHover) {
            noBubble = addInProps.onMeshHover(data);
        }

        if (!noBubble && onMeshHover) {
            onMeshHover(marker, mesh, scene, pointerEvent);
        }
    };

    const meshClick = (
        marker: Marker,
        mesh: BABYLON.AbstractMesh,
        scene: BABYLON.Scene,
        pointerEvent: PointerEvent
    ) => {
        data.eventType = ADT3DAddInEventTypes.MarkerClick;
        data.marker = marker;
        data.mesh = mesh;
        data.scene = scene;
        data.pointerEvent = pointerEvent;
        let noBubble = false;
        if (addInProps?.onMeshClick) {
            noBubble = addInProps.onMeshClick(data);
        }

        if (!noBubble && onMeshClick) {
            onMeshClick(marker, mesh, scene, pointerEvent);
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

            setSelectedViewerMode({
                objectColor: objectColor,
                background: backgroundColor,
                isWireframe:
                    viewerMode.style === ViewerModeStyles.Wireframe
                        ? true
                        : false
            });

            if (objectColorUpdated) {
                objectColorUpdated(objectColor);
            }
        }
    };

    return (
        <div
            style={
                selectedViewerMode?.background.color
                    ? {
                          background: selectedViewerMode.background.color
                      }
                    : {}
            }
            className="cb-adt-3dviewer-wrapper "
        >
            {!hideViewModePickerUI && (
                <div className="cb-adt-3dviewer-render-mode-selection">
                    <ModelViewerModePicker
                        defaultViewerMode={{
                            objectColor: null,
                            style: ViewerModeStyles.Default,
                            background: ViewerModeBackgroundColors[0].color
                        }}
                        viewerModeUpdated={onViewerModeUpdated}
                        objectColors={ViewerModeObjectColors}
                        backgroundColors={ViewerModeBackgroundColors}
                    />
                </div>
            )}
            <div className={styles.viewerControlsContainer}>
                <CameraControls
                    onCameraInteractionChanged={(type) =>
                        setCameraInteractionType(type)
                    }
                    onCameraZoom={(zoom) =>
                        (sceneViewComponent.current as any)?.zoomCamera(zoom)
                    }
                    onResetCamera={() =>
                        (sceneViewComponent.current as any)?.resetCamera()
                    }
                />
            </div>
            <SceneView
                ref={sceneViewComponent}
                isWireframe={selectedViewerMode?.isWireframe}
                objectColors={selectedViewerMode?.objectColor}
                backgroundColor={selectedViewerMode?.background}
                {...svp}
                onMeshHover={meshHover}
                onMeshClick={meshClick}
                onSceneLoaded={sceneLoaded}
                cameraInteractionType={cameraInteractionType}
            />
        </div>
    );
};

const getStyles = memoizeFunction((_theme: Theme) => {
    return mergeStyleSets({
        viewerControlsContainer: {
            position: 'absolute',
            display: 'flex',
            width: '100%',
            top: 10
        }
    });
});
