import React from 'react';
import BlobDropdown from './BlobDropdown';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import BlobAdapter from '../../Adapters/BlobAdapter';
import { Supported3DFileTypes } from '../..';

export default {
    title: 'Components/BlobDropdown',
    component: BlobDropdown
};

export const DropdownFor3DFiles = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <BlobDropdown
            width={400}
            theme={theme}
            locale={locale}
            adapter={
                new BlobAdapter(
                    authenticationParameters.storage.blobContainerUrl,
                    new MsalAuthService(
                        authenticationParameters.storage.aadParameters
                    )
                )
            }
            fileTypes={Object.values(Supported3DFileTypes)}
            isRequired
            onChange={(blobPath) => {
                console.log(blobPath);
            }}
            selectedBlobUrl="https://mockStorageAccountName.blob.core.windows.net/mockContainerName/mockFile1.gltf"
        />
    );
};
