import React from 'react';
import { SceneView } from '../3DV/SceneView';
import './ADT3DBuilder.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ColoredMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import {
    IADT3DViewerRenderMode,
    IADTAdapter
} from '../../Models/Constants/Interfaces';
import BaseComponent from '../BaseComponent/BaseComponent';
import { AbstractMesh, Scene } from 'babylonjs';

interface ADT3DBuilderProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (clickedMesh: AbstractMesh, e: PointerEvent) => void;
    onMeshHovered?: (clickedMesh: AbstractMesh) => void;
    showMeshesOnHover?: boolean;
    coloredMeshItems?: ColoredMeshItem[];
    showHoverOnSelected?: boolean;
    renderMode?: IADT3DViewerRenderMode;
}

const ADT3DBuilder: React.FC<ADT3DBuilderProps> = ({
    adapter,
    modelUrl,
    onMeshClicked,
    onMeshHovered,
    showMeshesOnHover,
    coloredMeshItems,
    showHoverOnSelected,
    renderMode
}) => {
    const meshClick = (
        _marker: Marker,
        mesh: AbstractMesh,
        _scene: Scene,
        e: PointerEvent
    ) => {
        if (onMeshClicked) {
            onMeshClicked(mesh, e);
        }
    };

    const meshHover = (
        _marker: Marker,
        mesh: AbstractMesh,
        _scene: Scene,
        _e: PointerEvent
    ) => {
        if (onMeshHovered) {
            onMeshHovered(mesh);
        }
    };

    return (
        <BaseComponent>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMeshClick={meshClick}
                    onMeshHover={meshHover}
                    coloredMeshItems={coloredMeshItems}
                    showMeshesOnHover={showMeshesOnHover ?? true}
                    showHoverOnSelected={showHoverOnSelected}
                    renderMode={renderMode}
                    getToken={
                        (adapter as any).authService
                            ? () =>
                                  (adapter as any).authService.getToken(
                                      'storage'
                                  )
                            : undefined
                    }
                />
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(ADT3DBuilder);
