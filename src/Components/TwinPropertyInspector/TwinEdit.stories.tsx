import React from 'react';
import TwinEdit from './TwinEdix';
import { mockTwin, mockModel } from './mockData';

export default {
    title: 'Components/TwinEdit'
};

export const MockTwinEdit = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <TwinEdit twin={mockTwin} model={mockModel} />
    </div>
);
