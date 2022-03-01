import React, { useEffect, useState } from 'react';
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
    onMeshSelected?: (selectedMeshes: string[]) => void;
    showMeshesOnHover?: boolean;
    preselectedMeshIds?: Array<string>;
    coloredMeshItems?: ColoredMeshItem[];
}

const ADT3DBuilder: React.FC<ADT3DBuilderProps> = ({
    adapter,
    modelUrl,
    onMeshSelected,
    showMeshesOnHover,
    preselectedMeshIds,
    coloredMeshItems
}) => {
    const [selectedMeshIds, setselectedMeshIds] = useState<string[]>(
        preselectedMeshIds ?? []
    );

    useEffect(() => {
        if (preselectedMeshIds) {
            setselectedMeshIds(preselectedMeshIds);
        }
    }, [preselectedMeshIds]);

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
        <BaseComponent>
            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMarkerClick={(marker, mesh) =>
                        onMeshSelected && meshClick(marker, mesh)
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
