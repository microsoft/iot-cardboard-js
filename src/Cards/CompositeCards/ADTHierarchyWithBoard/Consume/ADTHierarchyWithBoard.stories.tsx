import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyWithBoard from './ADTHierarchyWithBoard';

export default {
    title: 'CompositeCards/ADTHierarchyWithBoard/Consume'
};

export const ADT = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ADTHierarchyWithBoard
                title={'Twins'}
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
