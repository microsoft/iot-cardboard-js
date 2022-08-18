import React from 'react';
import {
    mockTwin,
    mockRelationship,
    mockExpandedModels
} from './__mockdata__/mockData';
import mockExpandedModel from './__mockdata__/TeslaExampleModels.json';
import StandalonePropertyInspector from './StandalonePropertyInspector';
import { DtdlInterface } from '../..';

export default {
    title: 'Components/Property Inspector/Standalone',
    component: StandalonePropertyInspector
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
                expandedModels: mockExpandedModels as DtdlInterface[],
                rootModel: mockExpandedModels[0] as DtdlInterface
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
                expandedModels: mockExpandedModels as DtdlInterface[],
                rootModel: mockExpandedModels[0] as DtdlInterface
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
                expandedModels: mockExpandedModels as DtdlInterface[],
                rootModel: mockExpandedModels[0] as DtdlInterface
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
                relationshipModel: mockExpandedModels[0] as DtdlInterface
            }}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const MissingSomeModelsMock = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: mockExpandedModels.slice(
                    0,
                    2
                ) as DtdlInterface[],
                rootModel: mockExpandedModels[0] as DtdlInterface
            }}
            missingModelIds={mockExpandedModel.slice(2).map((mm) => mm['@id'])}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const MissingAllModelsMock = (_args, { globals: { theme, locale } }) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={{
                twin: mockTwin,
                expandedModels: null,
                rootModel: null
            }}
            onCommitChanges={(patch) => console.log(patch)}
            theme={theme}
            locale={locale}
        />
    </div>
);

export const PropertyInspectorErrorBoundary = (
    _args,
    { globals: { theme, locale } }
) => (
    <div style={propertyInspectorStoryStyles}>
        <StandalonePropertyInspector
            inputData={null}
            theme={theme}
            locale={locale}
            onErrorBoundary={(error, errorInfo) => {
                console.log('in onErrorBoundary callback.', error, errorInfo);
            }}
        />
    </div>
);
