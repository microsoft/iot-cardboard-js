import React from 'react';
import LinechartCard from './LinechartCard';
import TsiAdapter from '../../Adapters/TsiAdapter';
import { SearchSpan } from '../../Models/Classes/SearchSpan';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADXAdapter from '../../Adapters/ADXAdapter';

export default {
    title: 'Cards/LinechartCard',
    component: LinechartCard
};

export const TsiData = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();
    const tsiId = 'df4412c4-dba2-4a52-87af-780e78ff156b';
    const tsiProperties = ['value'];
    const tsiSearchSpan = new SearchSpan(
        new Date('2017-04-20T20:00:00Z'),
        new Date('2017-05-20T20:00:00Z'),
        '6h'
    );
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={defaultCardWrapperStyle}>
            <LinechartCard
                theme={theme}
                locale={locale}
                id={tsiId}
                searchSpan={tsiSearchSpan}
                properties={tsiProperties}
                adapter={
                    new TsiAdapter(
                        authenticationParameters.tsi.environmentFqdn,
                        new MsalAuthService(
                            authenticationParameters.tsi.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const ADXData = (
    _args,
    { globals: { theme, locale }, parameters: { defaultCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();
    const twinId = 'CarTwin';
    const twinProperties = ['Speed', 'OilPressure'];
    const twinSearchSpan = new SearchSpan(
        new Date('2021-09-10'),
        new Date('2021-09-17'),
        '6h'
    );
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={defaultCardWrapperStyle}>
            <LinechartCard
                title={twinId}
                theme={theme}
                locale={locale}
                id={twinId}
                searchSpan={twinSearchSpan}
                properties={twinProperties}
                adapter={
                    new ADXAdapter(
                        new MsalAuthService(
                            authenticationParameters.adx.aadParameters
                        ),
                        {
                            kustoClusterUrl:
                                authenticationParameters.adx.clusterUrl,
                            kustoDatabaseName:
                                authenticationParameters.adx.databaseName,
                            kustoTableName:
                                authenticationParameters.adx.tableName
                        }
                    )
                }
            />
        </div>
    );
};
