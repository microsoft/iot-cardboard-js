import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import { IHierarchyNode } from '../../../Models/Constants';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import { parseViewProperties } from '../../../Models/Services/Utils';
import ADTHierarchyWithLKVProcessGraphicsCard from './ADTHierarchyWithLKVProcessGraphicsCard';

export default {
    title: 'Cards/CompositeCards/AdtHierarchyWithLkvProcessGraphicsCard',
    component: ADTHierarchyWithLKVProcessGraphicsCard
};

const cardStyle = {
    height: '500px',
    width: '100%'
};

export const ADTHiearchyWithLKVPG = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTHierarchyWithLKVProcessGraphicsCard
                title={'Hierarchy With LKV Process Graphics'}
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
                getHierarchyNodeProperties={(node: IHierarchyNode) =>
                    parseViewProperties(node.nodeData.$metadata)}
                pollingIntervalMillis={5000}
            />
        </div>
    );
};
