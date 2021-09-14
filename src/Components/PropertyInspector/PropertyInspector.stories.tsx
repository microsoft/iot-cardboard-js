import React from 'react';
import {
    mockTwin,
    mockRelationship,
    mockRelationshipPropertiesModel
} from './MockData/mockData';
import mockExpandedModel from './MockData/TeslaExampleModels.json';
import StandalonePropertyInspector from './StandalonePropertyInspector';
export default {
    title: 'Components/Property Inspector/Standalone'
};

const propertyInspectorStoryStyles = {
    maxWidth: '360px',
    width: '100%'
};

export const TwinMock = () => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const SmallContainer = () => (
    <div style={{ width: 300, height: 400, overflow: 'auto' }}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const ReadOnlyTwinMock = () => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            readonly={true}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const RelationsipMock = () => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                relationship: mockRelationship,
                relationshipDefinition: mockRelationshipPropertiesModel
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);
