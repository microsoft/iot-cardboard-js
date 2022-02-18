/*

This class intercepts calls to the SceneViewer and enables AddIns to hook into events

*/

import React from 'react';
import * as BABYLON from 'babylonjs';
import { IADT3DViewerAdapter } from '../../Models/Constants/Interfaces';
import { IScenesConfig } from '../../Models/Classes/3DVConfig';
import {
    ISceneViewProp,
    Marker,
    SceneVisual
} from '../../Models/Classes/SceneView.types';
import { SceneView } from './SceneView';
import { ADT3DAddInEventTypes } from '../../Models/Constants/Enums';

export class ADT3DAddInEventData {
    eventType: ADT3DAddInEventTypes;
    config: IScenesConfig;
    sceneId: string;
    adapter: IADT3DViewerAdapter;
    sceneVisuals?: SceneVisual[];
    marker: Marker;
    mesh: BABYLON.AbstractMesh;
    scene: BABYLON.Scene;
    pointerEvent: PointerEvent;
}

export interface IADT3DAddInProps {
    onSceneLoaded?: (data: ADT3DAddInEventData) => boolean;
    onMarkerClick?: (data: ADT3DAddInEventData) => boolean;
    onMarkerHover?: (data: ADT3DAddInEventData) => boolean;
}

export interface ISceneViewWrapperProps {
    config: IScenesConfig;
    sceneId: string;
    adapter: IADT3DViewerAdapter;
    sceneViewProps: ISceneViewProp;
    sceneVisuals?: SceneVisual[];
    addInProps?: IADT3DAddInProps;
}

export const SceneViewWrapper: React.FC<ISceneViewWrapperProps> = ({
    config,
    sceneId,
    adapter,
    sceneViewProps,
    sceneVisuals,
    addInProps
}) => {
    const {
        onMarkerHover,
        onMarkerClick,
        onSceneLoaded,
        ...svp
    } = sceneViewProps;

    const data = new ADT3DAddInEventData();
    data.adapter = adapter;
    data.config = config;
    data.sceneId = sceneId;
    data.sceneVisuals = sceneVisuals;

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

    const markerHover = (
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
        if (addInProps?.onMarkerHover) {
            noBubble = addInProps.onMarkerHover(data);
        }

        if (!noBubble && onMarkerHover) {
            onMarkerHover(marker, mesh, scene, pointerEvent);
        }
    };

    const markerClick = (
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
        if (addInProps?.onMarkerClick) {
            noBubble = addInProps.onMarkerClick(data);
        }

        if (!noBubble && onMarkerClick) {
            onMarkerClick(marker, mesh, scene, pointerEvent);
        }
    };

    return (
        <SceneView
            {...svp}
            onMarkerHover={markerHover}
            onMarkerClick={markerClick}
            onSceneLoaded={sceneLoaded}
        />
    );
};
