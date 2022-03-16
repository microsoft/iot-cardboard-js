import React from 'react';
import { ADTAdapter, MsalAuthService } from '../..';
import useAuthParams from '../../../.storybook/useAuthParams';

import ADTModelListCard from './ADTModelListCard';

export default {
    title: 'Cards/ADTModelListCard',
    component: ADTModelListCard,
};

const modelListCardStyle = {
    height: '480px',
    width: '320px',
};

export const ADTModelList = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={modelListCardStyle}>
            <ADTModelListCard
                title={'ADT Models'}
                theme={theme}
                locale={locale}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters,
                        ),
                    )
                }
                onModelClick={(model) => {
                    console.log(`${model.id} is clicked!`);
                }}
                onNewModelClick={() => {
                    console.log('New button clicked!');
                }}
            />
        </div>
    );
};
