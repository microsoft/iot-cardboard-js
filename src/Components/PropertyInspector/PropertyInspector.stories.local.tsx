import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
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
