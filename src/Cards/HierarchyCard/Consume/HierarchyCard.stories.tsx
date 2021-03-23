import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import HierarchyCard from './HierarchyCard';

export default {
    title: 'HierarchyCard/Consume'
};

const hierarchyCardStyle = {
    height: '400px',
    width: '720px'
};

export const ADTHierarchy = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={hierarchyCardStyle}>
            <HierarchyCard
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
