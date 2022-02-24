import React from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import IoTCentralAdapter from '../../Adapters/IoTCentralAdapter';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';
import LKVProcessGraphicCard from './LKVProcessGraphicCard';

export default {
    title: 'Cards/LkvProcessGraphicCard',
    component: LKVProcessGraphicCard
};

const iotCentral = {
    id: 'j3172f7q3n',
    properties: ['battery', 'fuel', 'location'],
    positions: {
        battery: { left: '10%', top: '20%' },
        fuel: { left: '80%', top: '40%' },
        location: { left: '30%', top: '70%' }
    }
};

const digitalTwins = {
    id: 'CarTwin',
    properties: ['OutdoorTemperature', 'Speed', 'OilPressure'],
    positions: {
        OutdoorTemperature: { left: '80%', top: '5%' },
        Speed: { left: '80%', top: '40%' },
        OilPressure: { left: '30%', top: '70%' }
    }
};

const imageSrc =
    'data:image/jpeg;base64,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';

export const IoTCentral = (
    _args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wideCardWrapperStyle}>
            <LKVProcessGraphicCard
                id={iotCentral.id}
                imageSrc={imageSrc}
                pollingIntervalMillis={5000}
                properties={iotCentral.properties}
                imagePropertyPositions={iotCentral.positions}
                title={'Real-time Truck Status'}
                theme={theme}
                locale={locale}
                adapter={
                    new IoTCentralAdapter(
                        authenticationParameters.iotCentral.appId,
                        new MsalAuthService(
                            authenticationParameters.iotCentral.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};

export const ADT = (
    _args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wideCardWrapperStyle}>
            <LKVProcessGraphicCard
                id={digitalTwins.id}
                imageSrc={imageSrc}
                pollingIntervalMillis={5000}
                properties={digitalTwins.properties}
                imagePropertyPositions={digitalTwins.positions}
                title={'Real-time Car Twin Status'}
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
            />
        </div>
    );
};
