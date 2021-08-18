import React from 'react';
import FileUploader from './FileUploader';

export default {
    title: 'Components/FileUploader'
};

export const UploadFiles = (_args) => {
    return (
        <div
            style={{
                width: '800px',
                height: '300px'
            }}
        >
            <FileUploader />
        </div>
    );
};
