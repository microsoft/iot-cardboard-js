import React from 'react';
import BlobDropdown from './BlobDropdown';
import { MockAdapter, Supported3DFileTypes } from '../..';

export default {
    title: 'Components/BlobDropdown',
    component: BlobDropdown
};

export const MockBlobDropdown = (_args, { globals: { theme, locale } }) => {
    return (
        <BlobDropdown
            width={400}
            theme={theme}
            locale={locale}
            adapter={new MockAdapter()}
            fileTypes={Object.values(Supported3DFileTypes)}
            isRequired
            onChange={(blobPath) => {
                console.log(blobPath);
            }}
            selectedBlobUrl={"https://mockStorageAccountName.blob.core.windows.net/mockContainerName/mockFile1.gltf"}
        />
    );
};
