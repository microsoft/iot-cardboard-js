import React, { useState } from 'react';
import OATGraphViewer from './OATGraphViewer';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args) => {
    const [elementHandler, setElementHandler] = useState([]);

    return (
        <div>
            <OATGraphViewer setElementHandler={setElementHandler} />
        </div>
    );
};
