import React, { useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { IADTAdapter } from '../../Models/Constants/Interfaces';

interface ADT3DBuilderCardProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    onMeshSelected?: (selectedMeshIds: string[]) => void;
}

const ADT3DBuilderCard: React.FC<ADT3DBuilderCardProps> = ({
    adapter,
    modelUrl,
    title,
    onMeshSelected
}) => {
    const [selectedMeshIds, setselectedMeshIds] = useState<string[]>([]);

    const meshClick = (_marker: Marker, mesh: any) => {
        let meshes = [...selectedMeshIds];
        if (mesh) {
            const selectedMesh = selectedMeshIds.find(
                (item) => item === mesh.id
            );
            if (selectedMesh) {
                meshes = selectedMeshIds.filter(
                    (item) => item !== selectedMesh
                );
                setselectedMeshIds(meshes);
            } else {
                meshes.push(mesh.id);
                setselectedMeshIds(meshes);
            }
        } else {
            setselectedMeshIds([]);
        }

        onMeshSelected(meshes);
    };

    return (
        <BaseCard title={title} isLoading={false} adapterResult={null}>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMarkerClick={(marker, mesh) =>
                        onMeshSelected && meshClick(marker, mesh)
                    }
                    showMeshesOnHover={true}
                    selectedMeshIds={selectedMeshIds}
                    meshHoverColor="#FCFF80"
                    meshSelectionColor="#00A8F0"
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
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DBuilderCard);
