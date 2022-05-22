import React from 'react';
import ADTInstances from './ADTInstances';
import useAuthParams from '../../../.storybook/useAuthParams';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import { ADT3DSceneAdapter } from '../../Adapters';

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
                new ADT3DSceneAdapter(
                    new MsalAuthService(
                        authenticationParameters.adt.aadParameters
                    ),
                    authenticationParameters.adt.hostUrl,
                    authenticationParameters.storage.blobContainerUrl,
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
