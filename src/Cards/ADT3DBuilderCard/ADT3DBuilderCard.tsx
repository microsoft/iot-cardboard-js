import React, { useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';

interface ADT3DBuilderCardProps {
    modelUrl: string;
    title?: string;
    onMeshSelected?: (selectedMeshes: string[]) => void;
}

const ADT3DBuilderCard: React.FC<ADT3DBuilderCardProps> = ({
    modelUrl,
    title,
    onMeshSelected
}) => {
    const [selectedMeshes, setSelectedMeshes] = useState<string[]>([]);

    const meshClick = (_marker: Marker, mesh: any) => {
        let meshes = [...selectedMeshes];
        if (mesh) {
            const selectedMesh = selectedMeshes.find(
                (item) => item === mesh.id
            );
            if (selectedMesh) {
                meshes = selectedMeshes.filter((item) => item !== selectedMesh);
                setSelectedMeshes(meshes);
            } else {
                meshes.push(mesh.id);
                setSelectedMeshes(meshes);
            }
        } else {
            setSelectedMeshes([]);
        }

        onMeshSelected(meshes);
    };

    return (
        <BaseCard title={title} isLoading={false} adapterResult={null}>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMarkerClick={(marker, mesh) => meshClick(marker, mesh)}
                    showMeshesOnHover={true}
                    selectedMeshes={selectedMeshes}
                    meshHoverColor="#FCFF80"
                    meshSelectionColor="#00A8F0"
                />
            </div>
        </BaseCard>
    );
};

export default withErrorBoundary(ADT3DBuilderCard);
