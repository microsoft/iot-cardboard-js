import React from 'react';
import BIMViewer from './BIMViewer';

export default {
    title: 'Components/BIMViewer'
};

export const BasicBIMViewer = () => (
    <div
        style={{
            height: '400px',
            position: 'relative'
        }}
    >
        {/* right now this is hardcoded to external assets */}
        <BIMViewer
            bimFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplex.xkt"
            metadataFilePath="https://cardboardresources.blob.core.windows.net/carboard-bim-files/duplexMetaModel.json"
        />
    </div>
);
