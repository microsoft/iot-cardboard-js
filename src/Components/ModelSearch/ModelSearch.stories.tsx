import React from 'react';
import ModelSearch from './ModelSearch';

export default {
    title: 'Components/ModelSearch'
};

export const BasicModelSearch = (
    _args,
    { parameters: { wideCardWrapperStyle } }
) => (
    <div style={wideCardWrapperStyle}>
        <ModelSearch />
    </div>
);
