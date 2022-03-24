/*

This class intercepts calls to the SceneViewer and enables AddIns to hook into events

*/

import React, { useState } from 'react';
import * as BABYLON from 'babylonjs';
import { Marker } from '../../Models/Classes/SceneView.types';
import SceneView from './SceneView';
import { ADT3DAddInEventTypes } from '../../Models/Constants/Enums';
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
    IADTObjectColor,
    ViewerModeBackgroundColors,
    ViewerModeObjectColors
} from '../../Models/Constants';

export const SceneViewWrapper: React.FC<ISceneViewWrapperProps> = ({
    config,
    sceneId,
    adapter,
    sceneViewProps,
    sceneVisuals,
    addInProps,
    objectColorUpdated
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
            } else {
                objectColor = DefaultViewerModeObjectColor;
            }

            setSelectedViewerMode({
                objectColor: objectColor,
                background: viewerMode.background,
                isWireframe: viewerMode.style === 'wireframe' ? true : false
            });

            if (objectColorUpdated) {
                objectColorUpdated(objectColor);
            }
        }
    };

    return (
        <div
            style={
                selectedViewerMode?.background
                    ? { background: selectedViewerMode.background }
                    : {}
            }
            className="cb-adt-3dviewer-wrapper "
        >
            <div className="cb-adt-3dviewer-render-mode-selection">
                <ModelViewerModePicker
                    viewerModeUpdated={onViewerModeUpdated}
                    objectColors={ViewerModeObjectColors}
                    backgroundColors={ViewerModeBackgroundColors}
                />
            </div>
            <SceneView
                isWireframe={selectedViewerMode?.isWireframe}
                objectColors={selectedViewerMode?.objectColor}
                {...svp}
                onMeshHover={meshHover}
                onMeshClick={meshClick}
                onSceneLoaded={sceneLoaded}
            />
        </div>
    );
};
