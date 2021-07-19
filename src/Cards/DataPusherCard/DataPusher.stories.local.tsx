import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import ADTSimulationAdapter from '../../Adapters/ADTSimulationAdapter';
import AssetSimulation from '../../Models/Classes/Simulations/AssetSimulation';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import DataPusherCard from './DataPusherCard';

export default {
    title: 'Data pusher/Data Pusher'
};

const wrapperStyle = {
    height: '700px',
    width: '100%'
};

export const DataPusher = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wrapperStyle}>
            <DataPusherCard
                theme={theme}
                locale={locale}
                adapter={
                    new ADTSimulationAdapter(
                        new MsalAuthService(
                            authenticationParameters.adt.aadParameters
                        )
                    )
                }
                Simulation={AssetSimulation}
                initialInstanceUrl={authenticationParameters.adt.hostUrl}
                disablePastEvents={true}
            />
        </div>
    );
};
