import React from 'react';
import LinechartCard from './LinechartCard';
import TsiAdapter from '../../../Adapters/TsiAdapter';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import useAuthParams from '../../../../.storybook/useAuthParams';

export default {
    title: 'Linechart/Consume',
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
