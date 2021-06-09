import React from 'react';
import ModelSearch from './ModelSearch';

export default {
    title: 'Components/ModelSearch'
};

export const BasicModelSearch = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <ModelSearch
            onStandardModelSelection={(modelData) =>
                alert(JSON.stringify(modelData, null, 2))
            }
        />
    </div>
);
