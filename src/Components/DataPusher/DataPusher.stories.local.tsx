import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import { ADTAdapter } from '../../Adapters';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import DataPusher from './DataPusher';

export default {
    title: 'Components/DataPusher',
    component: DataPusher
};

const wrapperStyle = {
    height: '660px',
    width: '100%'
};

export const DataPusherStory = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <DataPusher
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
                initialInstanceUrl={authenticationParameters.adt.hostUrl}
                disablePastEvents={true}
            />
        </div>
    );
};
