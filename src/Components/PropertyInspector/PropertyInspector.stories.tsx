import React from 'react';
import {
    mockTwin,
    mockRelationship,
    mockRelationshipPropertiesModel,
    mockMediaTwin,
    mockHasMemberRelationship
} from './MockData/mockData';
import mockExpandedModel from './MockData/TeslaExampleModels.json';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import {
    MediaTwinModel,
    MediaTwinRelationships
} from '../../Models/Constants/MediaTwinModel';

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

export const MediaTwin = () => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockMediaTwin,
                expandedModels: [MediaTwinModel],
                rootModel: MediaTwinModel
            }}
            onCommitChanges={(patch) => console.log(patch)}
        />
    </div>
);

export const MediaTwinHasMember = () => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                relationship: mockHasMemberRelationship,
                relationshipDefinition: MediaTwinRelationships[0]
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
