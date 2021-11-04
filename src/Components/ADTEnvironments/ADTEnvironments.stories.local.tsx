import React from 'react';
import { useTranslation } from 'react-i18next';
import ADTEnvironments from './ADTEnvironments';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';

export default {
    title: 'Components/ADTEnvironments'
};

export const Environments = (args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ADTEnvironments
            adapter={
                new ADTAdapter(
                    authenticationParameters.adt.hostUrl,
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    )
                )
            }
            theme={theme}
            locale={locale}
        />
    );
};
