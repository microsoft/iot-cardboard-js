import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyWithBoardCard from './ADTHierarchyWithBoardCard';

export default {
    title: 'CompositeCards/ADTHierarchyWithBoardCard/Consume'
};

export const ADT = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div>
            <ADTHierarchyWithBoardCard
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
