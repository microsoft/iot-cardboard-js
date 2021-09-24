import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTandADXAdapter from '../../../../Adapters/ADTandADXAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyWithBoard from './ADTHierarchyWithBoard';

export default {
    title: 'CompositeCards/ADTHierarchyWithBoard/Consume'
};

const cardStyle = {
    height: '700px',
    width: '100%'
};

export const ADT = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTHierarchyWithBoard
                title={'Twins'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTandADXAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        new MsalAuthService(
                            authenticationParameters.azureManagement.aadParameters
                        ),
                        new MsalAuthService(
                            authenticationParameters.adx.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const ADTWithReverseLookup = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTHierarchyWithBoard
                title={'Twins with reverse lookup'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTandADXAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        new MsalAuthService(
                            authenticationParameters.azureManagement.aadParameters
                        ),
                        new MsalAuthService(
                            authenticationParameters.adx.aadParameters
                        )
                    )
                }
                lookupTwinId={args.lookupTwinId}
            />
        </div>
    );
};

ADTWithReverseLookup.argTypes = {
    lookupTwinId: {
        control: {
            type: 'text'
        },
        defaultValue: 'CarTwin'
    }
};
