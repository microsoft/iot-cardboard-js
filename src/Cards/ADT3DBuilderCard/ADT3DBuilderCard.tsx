import React from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import { Scene, Vector3 } from 'babylonjs';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker, SelectedMesh } from '../../Models/Classes/SceneView.types';

interface ADT3DBuilderCardProps {
    modelUrl: string;
    title?: string;
    onMeshSelected?: (
        meshes: SelectedMesh[],
    ) => void;
}

let selectedMeshes: SelectedMesh[] = [];

const ADT3DBuilderCard: React.FC<ADT3DBuilderCardProps> = ({
    modelUrl,
    title, 
    onMeshSelected
}) => {
    const meshClick = (marker: Marker, mesh: any, scene: Scene) => {
        if (mesh) {
            const selectedMesh = selectedMeshes.find(
                (item) => item.id === mesh.id
            );
            if (selectedMesh) {
                (mesh.material as any).albedoColor = selectedMesh.color;
                selectedMeshes = selectedMeshes.filter(
                    (item) => item !== selectedMesh
                );
            } else {
                const meshColor: SelectedMesh = new SelectedMesh();
                meshColor.id = mesh.id;
                meshColor.color = (mesh.material as any).albedoColor;
                selectedMeshes.push(meshColor);
                (mesh.material as any).albedoColor = BABYLON.Color3.FromHexString(
                    '#1EA0F7'
                );
            }
        } else {
            for (const meshColor of selectedMeshes) {
                const matchedMesh = scene.meshes.find(
                    (m) => m.id === meshColor.id
                );
                if (matchedMesh) {
                    (matchedMesh.material as any).albedoColor = meshColor.color;
                }
            }
            selectedMeshes = [];
        }

        onMeshSelected(selectedMeshes);
    };

    return (
        <BaseCard title={title} isLoading={false} adapterResult={null}>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    cameraRadius={800}
                    cameraCenter={new Vector3(0, 100, 0)}
                    onMarkerClick={(marker, mesh, scene) =>
                        meshClick(marker, mesh, scene)
                    }
                />
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DBuilderCard);
