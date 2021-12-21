import React, { useEffect, useState } from 'react';
import { SceneView } from '../../Components/3DV/SceneView';
import BaseCard from '../Base/Consume/BaseCard';
import './ADT3DBuilderCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { Marker } from '../../Models/Classes/SceneView.types';
import { IADTAdapter } from '../../Models/Constants/Interfaces';
import { PrimaryButton } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

interface ADT3DBuilderCardProps {
    adapter: IADTAdapter; // for now
    modelUrl: string;
    title?: string;
    objectMappingList?: any;
    onMeshSelected?: (selectedMeshes: string[]) => void;
}

const ADT3DBuilderCard: React.FC<ADT3DBuilderCardProps> = ({
    adapter,
    modelUrl,
    title,
    objectMappingList,
    onMeshSelected
}) => {
    const objects = objectMappingList;
    const [selectedMeshes, setSelectedMeshes] = useState<string[]>([]);
    const [objectList, setObjectList] = useState<string[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        setObjectList(objects);
    }, [objects]);

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

    const objectPop = (object: any) => {
        const meshes = [...selectedMeshes];
        const objects = document.getElementById(object);
        if (object) {
            objects.addEventListener(
                'mouseover',
                function (event) {
                    event.stopPropagation();
                    meshes.push(object);
                    setSelectedMeshes(meshes);
                },
                false
            );
            objects.addEventListener(
                'mouseout',
                function (event) {
                    event.stopPropagation();
                    setSelectedMeshes([]);
                },
                false
            );
        } else {
            setSelectedMeshes([]);
        }
    };

    const meshPop = (_marker: Marker, mesh: any) => {
        const meshes = [...selectedMeshes];
        const objects = [...objectList];

        if (mesh) {
            meshes.push(mesh.id);
            const matchingMesh = meshes.filter((element) =>
                objects.includes(element)
            );
            const matchingMeshToString = matchingMesh.toString();

            if (matchingMesh.length != 0) {
                document.getElementById(
                    matchingMeshToString
                ).style.backgroundColor = '#00A8F0';
                document.getElementById(matchingMeshToString).style.cursor =
                    'pointer';
            }
        } else {
            objects.filter((element) => {
                return (document.getElementById(
                    element.toString()
                ).style.backgroundColor = '');
            });
        }
    };

    return (
        <BaseCard title={title} isLoading={false} adapterResult={null}>
            {objectList.length > 0 ? (
                <div className="cb-object-list">
                    {objectList.map((object) => {
                        return (
                            <PrimaryButton
                                className="cb-object-list-buttons"
                                onMouseOver={() => {
                                    objectPop(object);
                                }}
                                id={object}
                            >
                                <div className="cb-object">{object}</div>
                            </PrimaryButton>
                        );
                    })}
                </div>
            ) : (
                <div className="cb-object-list-empty">
                    <p>{t('emptyList')}</p>
                </div>
            )}

            <div className="cb-adt3dbuilder-wrapper">
                <SceneView
                    modelUrl={modelUrl}
                    onMarkerClick={(marker, mesh) =>
                        onMeshSelected && meshClick(marker, mesh)
                    }
                    onMarkerHover={(marker, mesh) => {
                        meshPop(marker, mesh);
                    }}
                    showMeshesOnHover={true}
                    selectedMeshes={selectedMeshes}
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
