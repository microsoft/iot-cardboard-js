import React from 'react';
import BIMViewerCard from './BIMViewerCard';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { ADTAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';

export default {
    title: 'BIMViewerCard/Consume'
};

const wrapperStyle = {
    height: '500px',
    width: '500px'
};

export const ADT = (_args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <BIMViewerCard
                id={'bimFile'}
                theme={theme}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
