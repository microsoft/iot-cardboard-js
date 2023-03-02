import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import { AuthTokenTypes } from '../../Models/Constants';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import SceneView from './SceneView';

export default {
    title: 'Components/SceneView',
    component: 'SceneView'
};

export const BasicObjectWithAuth = () => {
    const authenticationParameters = useAuthParams();
    const authService = authenticationParameters
        ? new MsalAuthService(authenticationParameters.storage.aadParameters)
        : null;
    if (authService) {
        authService.login();
    }

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div
            style={{
                height: '100%',
                position: 'relative'
            }}
        >
            <SceneView
                modelUrl="https://cardboardresources.blob.core.windows.net/3dv-workspace-2/TruckBoxesEnginesPastmachine.gltf"
                getToken={() => authService.getToken(AuthTokenTypes.storage)}
            />
        </div>
    );
};
