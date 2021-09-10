import React from 'react';
import { DtdlRelationship } from '../../Models/Constants';
import {
    mockTwin,
    mockRelationship,
    mockRelationshipPropertiesModel
} from './__mockdata__/mockData';
import mockExpandedModel from './__mockdata__/TeslaExampleModels.json';
import StandalonePropertyInspector from './StandalonePropertyInspector';

export default {
    title: 'Components/Property Inspector/Standalone'
};

const propertyInspectorStoryStyles = {
    maxWidth: '428px',
    height: '600px',
    width: '100%'
};

export const TwinMock = (_args, { globals: { theme, locale } }) => (
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

export const SmallContainer = (_args, { globals: { theme, locale } }) => (
    <div style={{ width: 300, height: 400 }}>
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

export const ReadOnlyTwinMock = (_args, { globals: { theme, locale } }) => (
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

export const RelationsipMock = (_args, { globals: { theme, locale } }) => (
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
