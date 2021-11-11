import React, { useState } from 'react';
import { SceneView, Marker, SelectedMesh } from './SceneView';

export default {
    title: 'Components/SceneView'
};

export const Truck = () => {
    const [meshes, setMeshes] = useState([]);
    const meshClick = (
        marker: Marker,
        mesh: any,
        selectedMeshes: SelectedMesh[]
    ) => {
        setMeshes([...selectedMeshes]);
    };
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                cameraRadius={800}
                canSelectMesh={true}
                onMarkerClick={(marker, mesh, selectedMeshes) =>
                    meshClick(marker, mesh, selectedMeshes)
                }
            />
            <div style={{ position: 'absolute', top: '20px', left: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>Selected Meshes</div>
                {meshes.map((mesh, index) => (
                    <div key={index}>{mesh.id}</div>
                ))}
            </div>
        </div>
    );
};

export const Factory = () => {
    const [meshes, setMeshes] = useState([]);
    const meshClick = (
        marker: Marker,
        mesh: any,
        selectedMeshes: SelectedMesh[]
    ) => {
        setMeshes([...selectedMeshes]);
    };
    return (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/factory/4992245be3164456a07d1b237c24f016.gltf"
                cameraRadius={100}
                canSelectMesh={true}
                onMarkerClick={(marker, mesh, selectedMeshes) =>
                    meshClick(marker, mesh, selectedMeshes)
                }
            />
            <div style={{ position: 'absolute', top: '20px', left: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>Selected Meshes</div>
                {meshes.map((mesh, index) => (
                    <div key={index}>{mesh.id}</div>
                ))}
            </div>
        </div>
    );
};
