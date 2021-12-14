import React from 'react';
import ADT3DBuilderCard from './ADT3DBuilderCard';

export default {
    title: '3DV/ADT3DBuilderCard'
};

export const Engine = () => {
    const onMeshSelected = (selectedMeshes) => {
        console.log(selectedMeshes);
    };

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DBuilderCard
                title="3D Builder"
                modelUrl="https://cardboardresources.blob.core.windows.net/3dv-workspace-1/BasicObjects.gltf"
                onMeshSelected={(selectedMeshes) =>
                    onMeshSelected(selectedMeshes)
                }
            />
        </div>
    );
};
