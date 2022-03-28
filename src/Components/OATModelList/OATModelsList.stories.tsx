import React, { useState } from 'react';
import { default as OATModelListView } from './OATModelList';
import elements from '../../../.storybook/test_data/mockModel.json';

export default {
    title: 'Components/OATModelList',
    component: OATModelListView
};

export const OATModelList = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState(elements);

    const onHandleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div>
            <OATModelListView
                elements={elementHandler}
                theme={theme}
                onHandleElementsUpdate={onHandleElementsUpdate}
            />
        </div>
    );
};

export const Empty = (_args, { globals: { theme } }) => {
    const [elementHandler, setElementHandler] = useState([]);

    const onHandleElementsUpdate = (newElements) => {
        setElementHandler(newElements);
    };

    return (
        <div>
            <OATModelListView
                elements={elementHandler}
                theme={theme}
                onHandleElementsUpdate={onHandleElementsUpdate}
            />
        </div>
    );
};
