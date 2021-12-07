import React from 'react';
import ADT3DBuilderCard from './ADT3DBuilderCard';

export default {
    title: '3DV/ADT3DBuilderCard'
};

export const Truck = () => {
    const onMeshSelected = (selectedMeshes) => {
        console.log(selectedMeshes);
    };

    return (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DBuilderCard
                title="3D Builder"
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
                onMeshSelected={(selectedMeshes) =>
                    onMeshSelected(selectedMeshes)
                }
            />
        </div>
    );
};
