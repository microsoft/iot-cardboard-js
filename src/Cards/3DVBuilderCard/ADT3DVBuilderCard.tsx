import React, { useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import { Scene, Vector3 } from 'babylonjs';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DVBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { SelectedMesh, Marker } from '../../Models/Classes/SceneView.types';

interface ADT3DVBuilderCardProps {
    modelUrl: string;
    title?: string;
}

let selectedMeshes: SelectedMesh[] = [];

const ADT3DVBuilderCard: React.FC<ADT3DVBuilderCardProps> = ({
    modelUrl,
    title
}) => {
    const [meshes, setMeshes] = useState([]);

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

        setMeshes([...selectedMeshes]);
    };

    console.log('render', selectedMeshes);
    return (
        <BaseCard title={title} isLoading={false} adapterResult={null}>
            <div className="cb-adt3dvbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    cameraRadius={800}
                    cameraCenter={new Vector3(0, 100, 0)}
                    onMarkerClick={(marker, mesh, scene) =>
                        meshClick(marker, mesh, scene)
                    }
                />
                <div className="cb-adt3dvbuilder-mesh-list-container">
                    <div className="cb-adt3dvbuilder-mesh-list-title">
                        Selected Meshes
                    </div>
                    {meshes.map((mesh, index) => {
                        return <div key={index}>{mesh.id}</div>;
                    })}
                </div>
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DVBuilderCard);
