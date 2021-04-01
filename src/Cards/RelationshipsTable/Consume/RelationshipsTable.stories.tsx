import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { ADTAdapter, MockAdapter } from '../../../Adapters';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import RelationshipsTable from './RelationshipsTable';

export default {
    title: 'RelationshipsTable/Consume'
};

const relationshipsOnClick = (id: string, model: string, name: string) =>
    console.log(id, model, name);
export const ADTData = (args, { globals: { theme } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={{ height: '400px', width: '540px' }}>
            <RelationshipsTable
                theme={theme}
                id={args.twinID}
                title={`${args.twinID} relationships`}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                onRelationshipClick={relationshipsOnClick}
            />
        </div>
    );
};

ADTData.argTypes = {
    twinID: {
        control: {
            type: 'select',
            options: [
                'Xenia',
                'Phillip',
                'SaltMachine_C0',
                'OsloFactory',
                'Norway'
            ]
        },
        defaultValue: 'Phillip'
    }
};

export const MockData = (args, { globals: { theme } }) => {
    return (
        <div style={{ height: '400px', width: '540px' }}>
            <RelationshipsTable
                theme={theme}
                id={args.twinID}
                title={`Mock Relationships`}
                adapter={new MockAdapter()}
                onRelationshipClick={relationshipsOnClick}
            />
        </div>
    );
};
