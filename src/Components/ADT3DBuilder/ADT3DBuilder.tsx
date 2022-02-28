import React from 'react';
import { SceneView } from '../3DV/SceneView';
import './ADT3DBuilder.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { ColoredMeshItem, Marker } from '../../Models/Classes/SceneView.types';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import BaseComponent from '../BaseComponent/BaseComponent';

interface ADT3DBuilderProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshClicked?: (clickedMesh: any, e: any) => void;
    showMeshesOnHover?: boolean;
    selectedMeshIds?: Array<string>;
    coloredMeshItems?: ColoredMeshItem[];
}

const ADT3DBuilder: React.FC<ADT3DBuilderProps> = ({
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

export default withErrorBoundary(ADT3DBuilder);
