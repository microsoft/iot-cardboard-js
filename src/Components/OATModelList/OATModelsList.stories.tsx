import React, { useState } from 'react';
import { default as OATModelListView } from './OATModelList';
import elements from '../../../.storybook/test_data/mockModel.json';

export default {
    title: 'Components/OATModelList',
    component: OATModelListView
};

export const OATModelList = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState(elements);

    const handleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div>
            <OATModelListView
                elements={elementHandler}
                theme={theme}
                handleElementsUpdate={handleElementsUpdate}
            />
        </div>
    );
};

export const Empty = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState([]);

    const handleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };
    return (
        <div>
            <OATModelListView
                elements={elementHandler}
                theme={theme}
                handleElementsUpdate={handleElementsUpdate}
            />
        </div>
    );
};
