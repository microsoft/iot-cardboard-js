import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import { ADTModel_BIMContainerId } from '../../../Models/Constants';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import ADTHierarchyWithBIMViewerCard from './ADTHierarchyWithBIMViewerCard';

export default {
    title: 'Cards/CompositeCards/AdtHierarchyWithBimViewerCard',
    component: ADTHierarchyWithBIMViewerCard,
};

const cardStyle = {
    height: '500px',
    width: '100%',
};

export const ADTHierarchyWithBIMViewer = (
    _args,
    { globals: { theme, locale } },
) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTHierarchyWithBIMViewerCard
                title={'Hierarchy With BIM Viewer'}
                theme={theme}
                locale={locale}
                bimTwinId={ADTModel_BIMContainerId}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters,
                        ),
                    )
                }
                getHierarchyNodeProperties={() => []}
            />
        </div>
    );
};
