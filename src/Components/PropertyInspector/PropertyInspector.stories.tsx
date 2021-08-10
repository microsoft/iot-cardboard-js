import React from 'react';
import {
    mockTwin,
    mockExpandedModel,
    mockRootModel,
    mockRelationship
} from './MockData/mockData';
import StandalonePropertyInspector from './StandalonePropertyInspector';

export default {
    title: 'Components/Property Inspector'
};

export const TwinMock = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModel: mockExpandedModel,
                rootModel: mockRootModel
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const RelationsipMock = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <StandalonePropertyInspector
            inputData={{
                relationship: mockRelationship
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);
