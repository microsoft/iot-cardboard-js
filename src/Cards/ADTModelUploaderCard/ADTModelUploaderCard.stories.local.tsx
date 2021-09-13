import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTModelUploaderCard from './ADTModelUploaderCard';

export default {
    title: 'ADTModelUploaderCard/UploadJson'
};

export const ADTModelsUploader = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div
            style={{
                width: '800px',
                height: '520px'
            }}
        >
            <ADTModelUploaderCard
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                title="Upload DTDL model files"
                theme={theme}
                locale={locale}
                hasUploadButton={true}
                hasMessageBar={true}
            />
        </div>
    );
};
