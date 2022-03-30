import React from 'react';
import { default as OATModelListView } from './OATModelList';

export default {
    title: 'Components/OATModelList',
    component: OATModelListView
};

export const Default = (_args) => {

    return (
        <div>
            <OATModelListView/>
        </div>
    );
};
