import React from 'react';
import {
    mockTwin,
    mockRelationship,
    mockRelationshipPropertiesModel
} from './MockData/mockData';
import mockExpandedModel from './MockData/TeslaExampleModels.json';
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
                rootModel: mockExpandedModel[0]
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const RelationsipMock = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <StandalonePropertyInspector
            inputData={{
                relationship: mockRelationship,
                relationshipModel: mockRelationshipPropertiesModel
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);
