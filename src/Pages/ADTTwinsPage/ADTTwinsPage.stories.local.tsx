import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADT3DSceneAdapter from '../../Adapters/ADT3DSceneAdapter';
import { SearchSpan } from '../../Models/Classes/SearchSpan';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import ADTTwinsPage from './ADTTwinsPage';

export default {
    title: 'Pages/ADTTwinsPage',
    component: ADTTwinsPage,
    parameters: {
        noGlobalWrapper: true
    }
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
            <ADTTwinsPage
                title={'Twins'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl,
                        authenticationParameters.adt.aadParameters.tenantId,
                        authenticationParameters.adt.aadParameters.uniqueObjectId
                    )
                }
                searchSpanForDataHistory={
                    new SearchSpan(
                        new Date('2021-09-20T20:00:00Z'),
                        new Date('2021-10-20T20:00:00Z'),
                        '6h'
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
            <ADTTwinsPage
                title={'Twins with reverse lookup'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADT3DSceneAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        ),
                        authenticationParameters.adt.hostUrl,
                        authenticationParameters.storage.blobContainerUrl,
                        authenticationParameters.adt.aadParameters.tenantId,
                        authenticationParameters.adt.aadParameters.uniqueObjectId
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
