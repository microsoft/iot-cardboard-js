import React from 'react';
import { default as OATGraphViewerView } from './OATGraphViewer';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewerView
};

export const Default = (_args) => {

    return (
        <div>
            <OATGraphViewerView/>
        </div>
    );
};