import React from 'react';
import { DtdlRelationship } from '../../Models/Constants';
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
    maxWidth: '380px',
    width: '100%'
};

export const TwinMock = (args, { globals: { theme, locale } }) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const SmallContainer = (args, { globals: { theme, locale } }) => (
    <div style={{ width: 300, height: 400, overflow: 'auto' }}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const ReadOnlyTwinMock = (args, { globals: { theme, locale } }) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModel,
                rootModel: mockExpandedModel[0]
            }}
            readonly={true}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const RelationsipMock = (args, { globals: { theme, locale } }) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                relationship: mockRelationship,
                relationshipDefinition: mockRelationshipPropertiesModel as DtdlRelationship
            }}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);
