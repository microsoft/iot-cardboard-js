import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import { mockRelationship, mockTwin } from './__mockdata__/mockData';
import PropertyInspector from './PropertyInspector';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import ADTDataHistoryAdapter from '../../Adapters/ADTDataHistoryAdapter';

const propertyInspectorStoryStyles = {
    maxWidth: '428px',
    width: '100%'
};

export default {
    title: 'Components/Property Inspector',
    component: PropertyInspector,
    decorators: [getDefaultStoryDecorator(propertyInspectorStoryStyles)]
};

export const AdtTwin = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={propertyInspectorStoryStyles}>
            <PropertyInspector
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                twinId={args.twinId}
                theme={theme}
                locale={locale}
            />
        </div>
    );
};

export const AdtTwinWithDataHistory = (
    args,
    { globals: { theme, locale } }
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={propertyInspectorStoryStyles}>
            <PropertyInspector
                adapter={
                    new ADTDataHistoryAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl
                    )
                }
                twinId={args.twinId}
                theme={theme}
                locale={locale}
                hasDataHistoryControl={true}
            />
        </div>
    );
};

AdtTwin.argTypes = {
    twinId: {
        control: { type: 'text' },
        defaultValue: 'PasteurizationMachine_A01'
        // Array testing
        // defaultValue: 'widget1' //revert this
        // defaultValue: 'ezArray' //revert this
    }
};

AdtTwinWithDataHistory.argTypes = {
    twinId: {
        control: { type: 'text' },
        defaultValue: 'PasteurizationMachine_A01'
    }
};

export const AdtRelationship = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={propertyInspectorStoryStyles}>
            <PropertyInspector
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                relationshipId={args.relationshipId}
                twinId={args.twinId}
                theme={theme}
                locale={locale}
            />
        </div>
    );
};

AdtRelationship.argTypes = {
    twinId: {
        control: { type: 'text' },
        defaultValue: 'LeoTheDog'
    },
    relationshipId: {
        control: { type: 'text' },
        defaultValue: '2932c97a-2939-416f-93a9-ecccff9b82fd'
    }
};

export const ModeToggleWithResolvedData = (
    args,
    { globals: { theme, locale } }
) => {
    const authenticationParameters = useAuthParams();
    const [mode, setMode] = useState('twin');
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <button
                onClick={() =>
                    setMode((prev) =>
                        prev === 'twin' ? 'relationship' : 'twin'
                    )
                }
            >
                {mode === 'twin' ? 'Change to relationship' : 'Change to twin'}
            </button>
            <div style={propertyInspectorStoryStyles}>
                {mode === 'twin' ? (
                    <PropertyInspector
                        adapter={
                            new ADTAdapter(
                                authenticationParameters.adt.hostUrl,
                                new MsalAuthService(
                                    authenticationParameters.adt.aadParameters
                                )
                            )
                        }
                        twinId={args.twinId}
                        resolvedTwin={mockTwin}
                        theme={theme}
                        locale={locale}
                    />
                ) : (
                    <PropertyInspector
                        adapter={
                            new ADTAdapter(
                                authenticationParameters.adt.hostUrl,
                                new MsalAuthService(
                                    authenticationParameters.adt.aadParameters
                                )
                            )
                        }
                        relationshipId={args.relationshipId}
                        twinId={args.twinId}
                        resolvedRelationship={mockRelationship}
                        theme={theme}
                        locale={locale}
                    />
                )}
            </div>
        </div>
    );
};

ModeToggleWithResolvedData.argTypes = {
    twinId: {
        control: { type: 'text' },
        defaultValue: 'LeoTheDog'
    },
    relationshipId: {
        control: { type: 'text' },
        defaultValue: '4690c125-aac8-4456-9203-298c93f5fcf0'
    }
};
