import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import { ADTAdapter } from '../../Adapters';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import RelationshipsTable from './RelationshipsTable';

export default {
    title: 'Cards/RelationshipsTable',
    component: RelationshipsTable,
};

const relationshipsOnClick = (twin, model, errors) =>
    console.log(twin, model, errors);

export const ADTData = (
    args,
    { globals: { theme }, parameters: { wideCardWrapperStyle } },
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wideCardWrapperStyle}>
            <RelationshipsTable
                theme={theme}
                id={args.twinID}
                title={`${args.twinID} relationships`}
                adapter={
                    new ADTAdapter(
                        authenticationParameters.adt.hostUrl,
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters,
                        ),
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
                'Norway',
            ],
        },
        defaultValue: 'Phillip',
    },
};
