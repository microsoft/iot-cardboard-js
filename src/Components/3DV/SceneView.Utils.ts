import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { BadgeShape } from '../../Models/Constants/Enums';
import { measureText } from '../../Models/Services/Utils';

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

export function createBadge(badgeColor?: string, badgeShape?: BadgeShape, text?: string, textColor?: string, isIcon?: boolean ) {
    let badge;
    switch(badgeShape) {
        case BadgeShape.ELLIPSE:
            badge = new GUI.Ellipse();
            break;
        case BadgeShape.RECT:
            badge = new GUI.Rectangle();
            break;
        default:
            badge = new GUI.Ellipse();
            break;
    }

    badge.width = '40px';
    badge.height = '40px';
    badge.color = badgeColor || '#ffffff';
    badge.background = badgeColor || '#ffffff';

    if (text) {
        const width = measureText(text, 16);
        if (width > 40) {
            badge.width = width + 10 + 'px';
        }
        const textBlock = new GUI.TextBlock();
        if (isIcon) {
            textBlock.fontFamily = 'Segoe MDL2 Assets';
        }
        textBlock.fontSize = '16px';
        textBlock.color = textColor || '#000000';
        textBlock.text = text;
        badge.addControl(textBlock);
    }

    badge.onPointerEnterObservable.add(() => {
        document.body.style.cursor = 'pointer';
    });

    badge.onPointerOutObservable.add(() => {
        document.body.style.cursor = '';
    });

    badge.onPointerUpObservable.add(() => {
        alert('hello')
    });

    return badge;
}
