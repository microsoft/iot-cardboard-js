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
            bimFilePath="https://raw.githubusercontent.com/xeokit/xeokit-sdk/master/assets/models/xkt/duplex/duplex.xkt"
            metadataFilePath="https://raw.githubusercontent.com/xeokit/xeokit-sdk/master/assets/metaModels/duplex/metaModel.json"
            bimFileType="xkt"
        />
    </div>
);
