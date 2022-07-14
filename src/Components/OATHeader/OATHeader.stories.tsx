import React, { useState } from 'react';
import OATHeader from './OATHeader';

export default {
    title: 'Components/OATHeader',
    component: OATHeader
};

export const Default = () => {
    const [elements] = useState([]);

    return (
        <div>
            <OATHeader elements={elements} />
        </div>
    );
};
