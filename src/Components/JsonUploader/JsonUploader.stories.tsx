import React from 'react';
import JsonUploader from './JsonUploader';

export default {
    title: 'Components/JsonUploader',
    component: JsonUploader
};

export const UploadFiles = (_args) => {
    return (
        <div
            style={{
                width: '800px',
                height: '300px'
            }}
        >
            <JsonUploader />
        </div>
    );
};
