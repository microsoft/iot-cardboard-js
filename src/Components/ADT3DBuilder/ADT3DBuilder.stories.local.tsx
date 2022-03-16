import React from 'react';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DBuilder from './ADT3DBuilder';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';

export default {
    title: '3DV/ADT3DBuilder',
    component: 'ADT3DBuilder',
};

export const Engine = () => {
    const authenticationParameters = useAuthParams();

    const onMeshClicked = (clickedMesh) => {
        console.log('Clicked mesh ', clickedMesh);
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DBuilder
                title={'3D Builder'}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters,
                        ),
                    )
                }
                modelUrl={
                    'https://cardboardresources.blob.core.windows.net/3dv-workspace-2/TruckBoxesEnginesPastmachine.gltf'
                }
                onMeshClicked={onMeshClicked}
            />
        </div>
    );
};
