import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import { excludeLocalStoriesInProd } from '../../../Models/Services/Utils';
import ADTHierarchyCard from './ADTHierarchyCard';

export default {
    title: 'ADTHierarchyCard/Consume',
    ...excludeLocalStoriesInProd()
};

const hierarchyCardStyle = {
    height: '400px',
    width: '720px'
};

export const ADTHierarchy_LOCAL = (args, { globals: { theme, locale } }) => {
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
