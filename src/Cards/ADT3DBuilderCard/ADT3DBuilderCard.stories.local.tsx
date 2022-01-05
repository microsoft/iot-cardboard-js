import React from 'react';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DBuilderCard from './ADT3DBuilderCard';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';

export default {
    title: '3DV/ADT3DBuilderCard'
};

export const Engine = () => {
    const authenticationParameters = useAuthParams();

    const onMeshSelected = (selectedMeshes) => {
        console.log(selectedMeshes);
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DBuilderCard
                title="3D Builder"
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                modelUrl="https://cardboardresources.blob.core.windows.net/3dv-workspace-2/TruckBoxesEnginesPastmachine.gltf"
                onMeshSelected={(selectedMeshes) =>
                    onMeshSelected(selectedMeshes)
                }
            />
        </div>
    );
};
