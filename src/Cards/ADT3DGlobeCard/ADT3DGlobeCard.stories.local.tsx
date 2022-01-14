import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import BlobAdapter from '../../Adapters/BlobAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DGlobeCard from './ADT3DGlobeCard';

export default {
    title: '3DV/ADT3DGlobeCard'
};

export const Globe = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DGlobeCard
                title="Globe"
                adapter={
                    new BlobAdapter(
                        authenticationParameters.storage.blobContainerUrl,
                        new MsalAuthService(
                            authenticationParameters.storage.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
