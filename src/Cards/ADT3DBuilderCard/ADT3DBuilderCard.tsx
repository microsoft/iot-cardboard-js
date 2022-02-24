import React, { useEffect, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import './ADT3DBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ColoredMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

interface ADT3DBuilderCardProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (selectedMeshes: string[], e: any) => void;
    showMeshesOnHover?: boolean;
    selectedMeshIds?: Array<string>;
    coloredMeshItems?: ColoredMeshItem[];
}

const ADT3DBuilderCard: React.FC<ADT3DBuilderCardProps> = ({
    adapter,
    modelUrl,
    onMeshClicked,
    showMeshesOnHover,
    selectedMeshIds,
    coloredMeshItems
}) => {
    const meshClick = (_marker: Marker, mesh: any, _scene: any, e: any) => {
        onMeshClicked(mesh, e);
    };

    return (
        <BaseComponent>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMarkerClick={(marker, mesh, scene, e) =>
                        onMeshClicked && meshClick(marker, mesh, scene, e)
                    }
                    coloredMeshItems={coloredMeshItems}
                    showMeshesOnHover={showMeshesOnHover ?? true}
                    selectedMeshIds={selectedMeshIds}
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

export default withErrorBoundary(ADT3DBuilderCard);
