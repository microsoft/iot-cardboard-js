import React, { useState } from 'react';
import { default as OATHeaderView } from './OATHeader';

export default {
    title: 'Components/OATHeader',
    component: OATHeaderView
};

export const Default = (_args, { globals: { theme } }) => {
    const [modelName, setModelName] = useState('Home>Seattle factory');

    return (
        <div>
            <OATHeaderView theme={theme} modelNameInput={modelName} />
        </div>
    );
};
