import React from 'react';
import { SceneView } from '../3DV/SceneView';
import './ADT3DBuilder.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ColoredMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BaseComponent from '../BaseComponent/BaseComponent';
import { AbstractMesh, Scene } from 'babylonjs';

interface ADT3DBuilderProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (clickedMesh: AbstractMesh, e: PointerEvent) => void;
    showMeshesOnHover?: boolean;
    coloredMeshItems?: ColoredMeshItem[];
    showHoverOnSelected?: boolean;
}

const ADT3DBuilder: React.FC<ADT3DBuilderProps> = ({
    adapter,
    modelUrl,
    onMeshClicked,
    showMeshesOnHover,
    coloredMeshItems,
    showHoverOnSelected
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

    return (
        <BaseComponent>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMeshClick={meshClick}
                    coloredMeshItems={coloredMeshItems}
                    showMeshesOnHover={showMeshesOnHover ?? true}
                    showHoverOnSelected={showHoverOnSelected}
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
