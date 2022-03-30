import React from 'react';
import { default as OATHeaderView } from './OATHeader';

export default {
    title: 'Components/OATHeader',
    component: OATHeaderView
};

export const Default = (_args) => {
    return (
        <div>
            <OATHeaderView />
        </div>
    );
};
