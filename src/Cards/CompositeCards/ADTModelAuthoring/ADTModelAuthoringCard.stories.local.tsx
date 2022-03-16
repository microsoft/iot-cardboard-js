import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import { IADTModel } from '../../../Models/Constants/Interfaces';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import ADTModelAuthoringCard from './ADTModelAuthoringCard';

export default {
    title: 'Cards/CompositeCards/ADTModelAuthoringCard'
};

const cardStyle = {
    height: '720px',
    width: '100%'
};

export const ADTModelAuthoring = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={cardStyle}>
            <ADTModelAuthoringCard
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
                onCancel={() => console.log('Closed!')}
                onPublish={(models: Array<IADTModel>) =>
                    console.log(models.map((m) => m.id))}
            />
        </div>
    );
};
