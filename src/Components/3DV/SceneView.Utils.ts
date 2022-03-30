import * as BABYLON from 'babylonjs';
import * as GUI from 'babylonjs-gui';
import { SceneViewBadgeGroup } from '../../Models/Classes/SceneView.types';
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
    onClickCallback?: any
) {
    const badge = new GUI.Button();
    badge.widthInPixels = 20;
    badge.heightInPixels = 20;
    badge.background = 'transparent';
    badge.color = 'transparent';

    const badgeBackground = new GUI.Ellipse();
    badgeBackground.widthInPixels = 20;
    badgeBackground.heightInPixels = 20;
    badgeBackground.color = badgeColor || '#ffffff';
    badgeBackground.background = badgeColor || '#ffffff';
    badge.addControl(badgeBackground);

    if (text) {
        const textBlock = new GUI.TextBlock();
        textBlock.fontFamily = 'iconFont';
        textBlock.fontSizeInPixels = 12;
        textBlock.topInPixels = 3;
        textBlock.color = textColor || '#ffffff';
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

export function createBadgeGroup(badgeGroup: SceneViewBadgeGroup) {
    let background;
    const rows = Math.ceil(badgeGroup.badges.length / 2);
    if (badgeGroup.badges.length === 1) {
        background = new GUI.Ellipse();
        background.heightInPixels = 34;
        background.widthInPixels = 34;
    } else {
        background = new GUI.Rectangle();
        background.heightInPixels = 20 * rows + 10 + rows * 4;
        background.widthInPixels = 58;
        background.cornerRadius = 10;
    }

    background.paddingBottomInPixels = 4;
    background.paddingTopInPixels = 4;
    background.paddingLeftInPixels = 4;
    background.paddingRightInPixels = 4;
    background.color = '#1E2C5399';
    background.background = '#1E2C5399';

    const badgeContainer = new GUI.StackPanel();
    background.addControl(badgeContainer);

    let currentBadgeIndex = 0;
    for (let i = 0; i < rows; i++) {
        const row = new GUI.StackPanel();
        row.isVertical = false;
        row.heightInPixels = 20;
        badgeContainer.addControl(row);
        // add spacer if more than 1 row and not on the last row
        if (rows > 1 && i < rows - 1) {
            const spacer = new GUI.Rectangle();
            spacer.widthInPixels = 4;
            spacer.heightInPixels = 4;
            spacer.color = 'transparent';
            spacer.background = 'transparent';
            badgeContainer.addControl(spacer);
        }

        // only add 2 badges per row
        for (let b = 0; b < 2; b++) {
            if (badgeGroup.badges?.[currentBadgeIndex]) {
                const badge = createBadge(
                    badgeGroup.badges[currentBadgeIndex].color,
                    badgeGroup.badges[currentBadgeIndex].icon,
                    badgeGroup.badges[currentBadgeIndex].iconColor,
                    true
                );
                // add spacer after first badge
                if (b === 1) {
                    const spacer = new GUI.Rectangle();
                    spacer.widthInPixels = 4;
                    spacer.heightInPixels = 4;
                    spacer.color = 'transparent';
                    spacer.background = 'transparent';
                    row.addControl(spacer);
                }
                row.addControl(badge);
                currentBadgeIndex++;
            }
        }
    }

    return background;
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
