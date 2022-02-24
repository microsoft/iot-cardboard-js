import React from 'react';
import BIMViewer from './BIMViewer';

export default {
    title: 'Components/BIMViewer',
    component: BIMViewer
};

export const BasicBIMViewer = () => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BIMViewer
            bimFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplex.xkt"
            metadataFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json"
        />
    </div>
);

export const BIMViewerBadPath = () => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BIMViewer
            bimFilePath="https://bogusurl111.biz/fakeBIM.xkt"
            metadataFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json"
        />
    </div>
);

export const BIMViewerBadFileType = () => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        <BIMViewer
            bimFilePath="https://bogusurl111.biz"
            metadataFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json"
        />
    </div>
);
