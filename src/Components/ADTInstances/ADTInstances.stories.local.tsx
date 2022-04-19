import React from 'react';
import ADTInstances from './ADTInstances';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import AzureManagementAdapter from '../../Adapters/AzureManagementAdapter';

export default {
    title: 'Components/ADTInstances',
    ADTInstances
};

export const Instances = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <ADTInstances
            adapter={
                new AzureManagementAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.aadParameters.tenantId,
                    authenticationParameters.adt.aadParameters.uniqueObjectId
                )
            }
            theme={theme}
            locale={locale}
            hasLabel={true}
            onInstanceChange={(instanceHostName: string) =>
                console.log(instanceHostName)
            }
        />
    );
};
