import React from 'react';
import ADT3DVBuilderCard from './ADT3DVBuilderCard';

export default {
    title: '3DV/ADT3DVBuilderCard'
};

export const Truck = () => {
    return (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DVBuilderCard
                title="3D Builder"
                modelUrl="https://3dvstoragecontainer.blob.core.windows.net/3dvblobcontainer/model/Car.gltf"
            />
        </div>
    );
};
