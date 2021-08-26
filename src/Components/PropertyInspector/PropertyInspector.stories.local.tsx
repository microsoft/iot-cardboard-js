import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import { mockRelationship, mockTwin } from './MockData/mockData';
import PropertyInspector from './PropertyInspector';

export default {
    title: 'Components/Property Inspector'
};

const propertyInspectorStoryStyles = {
    maxWidth: '360px',
    width: '100%'
};

export const AdtTwin = (args) => {
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
            />
        </div>
    );
};

AdtTwin.argTypes = {
    twinId: {
        control: { type: 'text' },
        defaultValue: 'LeoTheDog'
    }
};

export const AdtRelationship = (args) => {
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
        defaultValue: '4690c125-aac8-4456-9203-298c93f5fcf0'
    }
};

export const ModeToggleWithResolvedData = (args) => {
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
