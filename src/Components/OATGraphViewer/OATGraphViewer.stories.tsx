import React, { useState } from 'react';
import OATGraphViewer from './OATGraphViewer';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewer
};

export const Default = (_args) => {
    const [elementHandler, setElementHandler] = useState([]);

    const handleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };
    return (
        <div>
            <OATGraphViewer onElementsUpdate={handleElementsUpdate} />
        </div>
    );
};
