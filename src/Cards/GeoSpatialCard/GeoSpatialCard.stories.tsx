import React, { useState } from 'react';
import useAuthParams from '../../../.storybook/useAuthParams';
import MockAdapter from '../../Adapters/MockAdapter';
import { ComponentErrorType } from '../../Models/Constants';
import GeoSpatialCard from './GeoSpatialCard';
import ADTAdapter from '../../Adapters/ADTAdapter';
import MsalAuthService from '../../Models/Services/MsalAuthService';

export default {
    title: 'Cards/GeoSpatialCard',
    component: 'GeoSpacialCard',
    parameters: {
        docs: {
            source: {
                type: 'code'
            }
        }
    }
};

const basicGeoData = [
    {
        id: 'boat1',
        properties: ['latitude', 'longitude']
    }
];

const adtGeoData = [
    {
        id: 'PasteurizationMachine_A02',
        properties: ['InFlow', 'OutFlow']
    }
];

export const Mock = (
    _args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const [properties] = useState({
        properties: basicGeoData[0].properties,
        id: basicGeoData[0].id
    });

    return (
        <div style={wideCardWrapperStyle}>
            <GeoSpatialCard
                id={properties.id}
                pollingIntervalMillis={1000}
                properties={properties.properties}
                title={'Current Boat Location'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter()}
            />
        </div>
    );
};

export const FailedToGetData = (
    _args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    return (
        <div style={wideCardWrapperStyle}>
            <GeoSpatialCard
                id={basicGeoData[0].id}
                pollingIntervalMillis={1000}
                properties={basicGeoData[0].properties}
                title={'Current Boat Location'}
                theme={theme}
                locale={locale}
                adapter={
                    new MockAdapter({
                        mockError: { type: ComponentErrorType.DataFetchFailed }
                    })
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
            <GeoSpatialCard
                id={adtGeoData[0].id}
                pollingIntervalMillis={1000}
                properties={adtGeoData[0].properties}
                title={'Current Boat Location'}
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
