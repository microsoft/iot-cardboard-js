import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { ADTAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import RelationshipsTable from './RelationshipsTable';

export default {
    title: 'RelationshipsTable/Consume'
};

export const BasicRelationshipsTable = (args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ height: '400px', width: '480px' }}>
            <RelationshipsTable
                theme={theme}
                id={'FireAlarmTwin'}
                properties={[]}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
