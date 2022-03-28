import React, { useState } from 'react';
import { default as OATGraphViewerView } from './OATGraphViewer';

export default {
    title: 'Components/OATGraphViewer',
    component: OATGraphViewerView
};

export const Default = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState([]);

    const onHandleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div>
            <OATGraphViewerView
                elements={elementHandler}
                theme={theme}
                onHandleElementsUpdate={onHandleElementsUpdate}
            />
        </div>
    );
};

export const Examples = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState({
        digitalTwinsModels: [
            {
                '@id': 'dtmi:com:example:adtexplorer:Building;1',
                '@type': 'Interface',
                displayName: 'Building1',
                contents: [
                    {
                        '@type': 'Relationship',
                        name: 'isEquippedWith',
                        target: 'dtmi:com:example:adtexplorer:HVAC;1'
                    }
                ]
            },
            {
                '@id': 'dtmi:com:example:adtexplorer:HVAC;1',
                '@type': 'Interface',
                displayName: 'HVAC1',
                contents: []
            }
        ]
    });

    const onHandleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div>
            <OATGraphViewerView
                elements={elementHandler}
                theme={theme}
                onHandleElementsUpdate={onHandleElementsUpdate}
            />
        </div>
    );
};
