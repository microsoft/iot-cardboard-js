import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHeirarchyWithBIMViewerCard from './ADTHeirarchyWithBIMViewerCard';

export default {
    title: 'CompositeCards/ADTHierarchyWithBIMViewerCard/Consume'
};

const cardStyle = {
    height: '500px',
    width: '100%'
};

export const ADTHiearchyWithLKVPG = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const getTwinProperties = () => {
        return [];
    };

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTHeirarchyWithBIMViewerCard
                title={'Hierarchy With BIM Viewer'}
                theme={theme}
                locale={locale}
                bimTwinId={'TODO_BIMName'}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                getHierarchyNodeProperties={getTwinProperties}
            />
        </div>
    );
};
