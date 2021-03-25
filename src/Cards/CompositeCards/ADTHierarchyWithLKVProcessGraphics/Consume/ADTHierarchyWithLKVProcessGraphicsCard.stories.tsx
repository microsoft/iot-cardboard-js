import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import { IHierarchyNode } from '../../../../Models/Constants';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyWithLKVProcessGraphicsCard from './ADTHierarchyWithLKVProcessGraphicsCard';

export default {
    title: 'CompositeCards/ADTHierarchyWithLKVProcessGraphicsCard/Consume'
};

const cardStyle = {
    height: '500px',
    width: '100%'
};

export const ADTHiearchyWithLKVPG = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const getTwinProperties = (node: IHierarchyNode) => {
        return Object.keys(node.nodeData.$metadata).filter(
            (key) =>
                key !== '$model' &&
                key !== 'imgSrc' &&
                key !== 'imgPropertyPositions'
        );
    };

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
                getHierarchyNodeProperties={getTwinProperties}
            />
        </div>
    );
};
