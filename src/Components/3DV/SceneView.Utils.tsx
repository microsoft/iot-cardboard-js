import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { AbstractMesh } from '@babylonjs/core/Legacy/legacy';
import { Marker } from '../../Models/Classes/SceneView.types';
import {
    GroupLabelWidth,
    Scene_Marker
} from '../../Models/Constants/SceneView.constants';
import './SceneView.scss';
import { ModelGroupLabel } from '../ModelGroupLabel/ModelGroupLabel';
import React from 'react';

export function getMeshCenter(
    mesh: BABYLON.AbstractMesh,
    scene: BABYLON.Scene,
    wrapper: HTMLElement
) {
    const meshVectors = mesh.getBoundingInfo().boundingBox.vectors;
    const worldMatrix = mesh.getWorldMatrix();
    const transformMatrix = scene.getTransformMatrix();
    const viewport = scene.activeCamera?.viewport;

    const coordinates = meshVectors.map((v) => {
        const proj = BABYLON.Vector3.Project(
            v,
            worldMatrix,
            transformMatrix,
            viewport
        );
        proj.x = proj.x * wrapper.clientWidth;
        proj.y = proj.y * wrapper.clientHeight;
        return proj;
    });

    const maxX = Math.max(...coordinates.map((p) => p.x));
    const minX = Math.min(...coordinates.map((p) => p.x));
    const maxY = Math.max(...coordinates.map((p) => p.y));
    const minY = Math.min(...coordinates.map((p) => p.y));

    return [(maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY];
}

export function createCustomMeshItems(meshIds: string[], color: string) {
    const items = [];
    for (const id of meshIds) {
        items.push({ meshId: id, color: color });
    }
    return items;
}

// Get the total bounding box of an array of meshes
export function getBoundingBox(meshes: BABYLON.AbstractMesh[]) {
    let boundingInfo = meshes?.[0]?.getBoundingInfo();
    if (!boundingInfo) {
        return null;
    }

    let min = boundingInfo.boundingBox.minimumWorld;
    let max = boundingInfo.boundingBox.maximumWorld;

    for (const mesh of meshes) {
        boundingInfo = mesh.getBoundingInfo();
        min = BABYLON.Vector3.Minimize(
            min,
            boundingInfo.boundingBox.minimumWorld
        );
        max = BABYLON.Vector3.Maximize(
            max,
            boundingInfo.boundingBox.maximumWorld
        );
    }
    return new BABYLON.BoundingInfo(min, max);
}

export const getMarkerPosition = (
    marker: Marker,
    meshMap: any,
    scene: BABYLON.Scene,
    camera: BABYLON.ArcRotateCamera,
    engine: BABYLON.Engine
) => {
    const lat = marker.latitude;
    const lon = marker.longitude;
    const position = { left: 0, top: 0 };
    let pos: BABYLON.Vector3 = null;
    const meshes: AbstractMesh[] = [];
    if (marker.attachedMeshIds) {
        for (const id of marker.attachedMeshIds) {
            const mesh = meshMap[id];
            if (!mesh) {
                console.log('Mesh not found ' + id);
                return null;
            }
            meshes.push(mesh);
        }
        pos = getBoundingBox(meshes).boundingBox.centerWorld;
    } else {
        pos = convertLatLonToVector3(lat, lon);
    }

    if (scene && camera && engine) {
        const coordinates = BABYLON.Vector3.Project(
            pos,
            BABYLON.Matrix.Identity(),
            scene?.getTransformMatrix(),
            camera?.viewport?.toGlobal(
                engine?.getRenderWidth(),
                engine?.getRenderHeight()
            )
        );

        if (!coordinates) {
            return null;
        }

        if (!marker.showIfOccluded) {
            // If the marker is occluded, don't show label
            const p = scene.pick(
                coordinates.x,
                coordinates.y,
                (mesh) => {
                    return !!mesh;
                },
                false,
                camera
            );

            // You'll have to leave the marker stuff in for this to work, but just use the transparent ones
            // There's two spheres for each marker, the red one and a transparent one
            // If we hit something unexoected, its occluded
            const name = p?.pickedMesh?.name;
            const show =
                name &&
                (name?.startsWith(Scene_Marker) ||
                    (marker.attachedMeshIds &&
                        marker.attachedMeshIds.includes(name)));
            if (!show) {
                return null;
            }
        }

        position.left = coordinates.x;
        position.top = coordinates.y;
    }

    return position;
};

export function convertLatLonToVector3(
    latitude: number,
    longitude: number,
    earthRadius = 50
): BABYLON.Vector3 {
    const latitude_rad = (latitude * Math.PI) / 180;
    const longitude_rad = (longitude * Math.PI) / 180;
    const x = earthRadius * Math.cos(latitude_rad) * Math.cos(longitude_rad);
    const z = earthRadius * Math.cos(latitude_rad) * Math.sin(longitude_rad);
    const y = earthRadius * Math.sin(latitude_rad);
    return new BABYLON.Vector3(x, y, z);
}

export const elementsOverlap = (
    renderedMarkerAndPosition: {
        marker: Marker;
        left: number;
        top: number;
    },
    markerToRenderUIElement: HTMLElement,
    markerPosition: { left: number; top: number }
) => {
    let doesOverlap = false;
    const markerElement = document.getElementById(
        renderedMarkerAndPosition.marker.id
    );

    const renderedMarkerUIElementArea = markerElement?.getBoundingClientRect();
    const markerToRenderUIElementArea = markerToRenderUIElement?.getBoundingClientRect();

    const markerIsGroup =
        renderedMarkerAndPosition.marker.UIElement?.props?.groupItems?.length;

    const markerElementWidth = markerIsGroup
        ? GroupLabelWidth
        : renderedMarkerUIElementArea?.right;

    if (renderedMarkerUIElementArea && markerToRenderUIElementArea) {
        doesOverlap = !(
            renderedMarkerUIElementArea.top + renderedMarkerAndPosition.top >
                markerToRenderUIElementArea.bottom + markerPosition.top ||
            markerElementWidth + renderedMarkerAndPosition.left <
                markerToRenderUIElementArea.left + markerPosition.left ||
            renderedMarkerUIElementArea.bottom + renderedMarkerAndPosition.top <
                markerToRenderUIElementArea.top + markerPosition.top ||
            renderedMarkerUIElementArea.left + renderedMarkerAndPosition.left >
                markerToRenderUIElementArea.right + markerPosition.left
        );
    }

    return doesOverlap;
};

export const removeGroupedItems = (
    markersAndPositions: { marker: Marker; left: number; top: number }[],
    marker: Marker
) => {
    // remove item if previously grouped
    markersAndPositions.forEach((markerAndPosition) => {
        if (
            markerAndPosition.marker.UIElement?.props?.groupItems?.find(
                (item) => item.label === marker.name
            )
        ) {
            const groupItems = markerAndPosition.marker.UIElement?.props?.groupItems?.filter(
                (item) => item.label !== marker.name
            );

            const groupedElement = (
                <ModelGroupLabel
                    label={groupItems.length}
                    groupItems={groupItems}
                />
            );

            markerAndPosition.marker.UIElement = groupedElement;
        }
    });
};

export const getCameraPosition = (camera: BABYLON.ArcRotateCamera) => {
    return {
        position: camera.position,
        target: camera.target,
        radius: camera.radius
    };
};
