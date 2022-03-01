import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import BlobAdapter from '../../Adapters/BlobAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADT3DGlobe from './ADT3DGlobe';

export default {
    title: '3DV/ADT3DGlobe'
};

export const Globe = () => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ width: '600px', height: '400px' }}>
            <ADT3DGlobe
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
