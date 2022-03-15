import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { measureText } from '../../Models/Services/Utils';
import './SceneView.scss';

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

export function createBadge(
    badgeColor?: string,
    text?: string,
    textColor?: string,
    isIcon?: boolean,
    onClickCallback?: any
) {
    const badge = new GUI.Button();
    badge.width = '40px';
    badge.height = '40px';
    badge.background = 'transparent';
    badge.color = 'transparent';

    const badgeBackground = new GUI.Ellipse();
    badgeBackground.width = '40px';
    badgeBackground.height = '40px';
    badgeBackground.color = badgeColor || '#ffffff';
    badgeBackground.background = badgeColor || '#ffffff';
    badge.addControl(badgeBackground);

    if (text) {
        const width = measureText(text, 16);
        if (width > 40) {
            badge.width = width + 10 + 'px';
            badgeBackground.width = width + 10 + 'px';
        }
        const textBlock = new GUI.TextBlock();
        if (isIcon) {
            textBlock.fontFamily = 'iconFont';
        }
        textBlock.fontSize = '16px';
        textBlock.color = textColor || '#000000';
        textBlock.text = text;
        badgeBackground.addControl(textBlock);
    }

    badge.onPointerEnterObservable.add(() => {
        document.body.style.cursor = 'pointer';
    });

    badge.onPointerOutObservable.add(() => {
        document.body.style.cursor = '';
    });

    badge.onPointerClickObservable.add(() => {
        if (onClickCallback) {
            onClickCallback();
        }
    });

    return badge;
}

export function createColoredMeshItems(meshIds: string[], color: string) {
    const items = [];
    for (const id of meshIds) {
        items.push({ meshId: id, color: color });
    }
    return items;
}

export function totalBoundingInfo(meshes: BABYLON.AbstractMesh[]) {
    let boundingInfo = meshes[0].getBoundingInfo();
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
