import React from 'react';
import { mockTwin, mockModel, mockComponents } from './MockData/mockData';
import StandalonePropertyInspector from './StandalonePropertyInspector';

export default {
    title: 'Components/Property Inspector'
};

export const StandalonePropertyInspectorMock = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <StandalonePropertyInspector
            twin={mockTwin}
            model={mockModel}
            components={mockComponents}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);
