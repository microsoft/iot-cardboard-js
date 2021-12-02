import React, { useState } from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../Models/Services/MsalAuthService';
import MockAdapter from '../../../Adapters/MockAdapter';
import { CardErrorType } from '../../../Models/Constants';
import GeoSpatial from './GeoSpatial';

export default {
    title: 'GeoSpatial/Consume',
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
    args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const [properties] = useState({
        properties: basicGeoData[0].properties,
        id: basicGeoData[0].id
    });

    return (
        <div style={wideCardWrapperStyle}>
            <GeoSpatial
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
    args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    return (
        <div style={wideCardWrapperStyle}>
            <GeoSpatial
                id={adtGeoData[0].id}
                pollingIntervalMillis={1000}
                properties={adtGeoData[0].properties}
                title={'Current Boat Location'}
                theme={theme}
                locale={locale}
                adapter={
                    new MockAdapter({
                        mockError: CardErrorType.DataFetchFailed
                    })
                }
            />
        </div>
    );
};

export const ADT = (
    args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={wideCardWrapperStyle}>
            <GeoSpatial
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
