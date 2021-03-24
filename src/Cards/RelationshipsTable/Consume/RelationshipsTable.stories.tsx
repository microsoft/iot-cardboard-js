import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { ADTAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import RelationshipsTable from './RelationshipsTable';

export default {
    title: 'RelationshipsTable/Consume'
};

const relationshipsOnClick = (id: string, model: string, name: string) =>
    console.log(id, model, name);
export const BasicRelationshipsTable = (args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ height: '400px', width: '540px' }}>
            <RelationshipsTable
                theme={theme}
                id={'Xenia'}
                properties={[]}
                title={'Xenia relationships'}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                relationshipOnClick={relationshipsOnClick}
            />
        </div>
    );
};
