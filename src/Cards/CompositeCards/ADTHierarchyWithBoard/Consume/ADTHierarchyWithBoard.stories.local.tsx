import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTandADXAdapter from '../../../../Adapters/ADTandADXAdapter';
import { SearchSpan } from '../../../../Models/Classes/SearchSpan';
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
                        )
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
            <ADTHierarchyWithBoard
                title={'Twins with reverse lookup'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTandADXAdapter(
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

ADTWithReverseLookup.argTypes = {
    lookupTwinId: {
        control: {
            type: 'text'
        },
        defaultValue: 'CarTwin'
    }
};
