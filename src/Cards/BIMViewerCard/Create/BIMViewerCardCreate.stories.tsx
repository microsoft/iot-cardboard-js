import React from 'react';
import BIMViewerCardCreate from './BIMViewerCardCreate';

export default {
    title: 'BIMViewerCard/Create'
};

export const Bar = (args, { globals: { theme } }) => (
    <BIMViewerCardCreate theme={theme} />
);
