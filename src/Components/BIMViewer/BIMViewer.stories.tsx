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
        <BIMViewer />
    </div>
);
