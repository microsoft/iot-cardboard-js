import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import ADTHierarchyCard from './ADTHierarchyCard';

export default {
    title: 'ADTHierarchyCard/Consume'
};

const hierarchyCardStyle = {
    height: '400px',
    width: '720px'
};

export const ADTHierarchy = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={hierarchyCardStyle}>
            <ADTHierarchyCard
                title={'ADT Hierarchy'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const ADTHierarchyWithReverseLookup = (
    args,
    { globals: { theme, locale } }
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={hierarchyCardStyle}>
            <ADTHierarchyCard
                title={'ADT Hierarchy with Reverse Lookup'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                lookupTwinId={args.lookupTwinId}
            />
        </div>
    );
};

ADTHierarchyWithReverseLookup.argTypes = {
    lookupTwinId: {
        control: {
            type: 'text'
        },
        defaultValue: 'CarTwin'
    }
};
