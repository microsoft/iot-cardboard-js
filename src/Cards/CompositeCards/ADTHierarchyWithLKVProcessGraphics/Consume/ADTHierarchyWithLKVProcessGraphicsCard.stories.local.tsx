import React from 'react';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    IHierarchyNode
} from '../../../../Models/Constants';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyWithLKVProcessGraphicsCard from './ADTHierarchyWithLKVProcessGraphicsCard';

export default {
    title: 'CompositeCards/ADTHierarchyWithLKVProcessGraphicsCard/Consume'
};

const cardStyle = {
    height: '500px',
    width: '100%'
};

export const ADTHiearchyWithLKVPG = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    const getTwinProperties = (node: IHierarchyNode) => {
        return Object.keys(node.nodeData.$metadata).filter(
            (key) =>
                !key.startsWith('$') &&
                key !== ADTModel_ImgSrc_PropertyName &&
                key !== ADTModel_ImgPropertyPositions_PropertyName
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
                pollingIntervalMillis={5000}
            />
        </div>
    );
};
