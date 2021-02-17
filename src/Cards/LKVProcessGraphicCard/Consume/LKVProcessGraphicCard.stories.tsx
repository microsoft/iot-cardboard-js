import React from 'react';
import { AuthenticationParameters } from '../../../../.storybook/parameters';
import IoTCentralAdapter from '../../../Adapters/IoTCentralAdapter';
import MockAdapter from '../../../Adapters/MockAdapter';
import MsalAuthService from '../../../Helpers/MsalAuthService';
import LKVProcessGraphicCard from './LKVProcessGraphicCard';

export default {
    title: 'LKVProcessGraphicCard/Consume'
};

const chartCardStyle = {
    height: '400px',
    width: '720px'
};

const iotcId = 'j3172f7q3n';
const iotcProperties = ['battery', 'fuel', 'location'];
const propertyPositions = {};
iotcProperties.forEach((prop) => {
    const position = () => {
        switch (prop) {
            case 'battery':
                return { left: '10%', top: '20%' };
            case 'fuel':
                return { left: '80%', top: '40%' };
            case 'location':
                return { left: '30%', top: '70%' };
        }
    };
    propertyPositions[prop] = position();
});
const imageSrc =
    'http://www.pngall.com/wp-content/uploads/2016/09/Cargo-Truck-Download-PNG.png';

export const Mock = (args, { globals: { theme } }) => {
    return (
        <div style={chartCardStyle}>
            <LKVProcessGraphicCard
                id={iotcId}
                imageSrc={imageSrc}
                pollingIntervalMillis={5000}
                properties={iotcProperties}
                additionalProperties={propertyPositions}
                title={'Real-time Truck Status'}
                theme={theme}
                adapter={new MockAdapter()}
            />
        </div>
    );
};

export const IoTCentral = (args, { globals: { theme } }) => {
    return (
        <div style={chartCardStyle}>
            <LKVProcessGraphicCard
                id={iotcId}
                imageSrc={imageSrc}
                pollingIntervalMillis={5000}
                properties={iotcProperties}
                additionalProperties={propertyPositions}
                title={'Real-time Truck Status'}
                theme={theme}
                adapter={
                    new IoTCentralAdapter(
                        AuthenticationParameters.iotCentral.appId,
                        new MsalAuthService(
                            AuthenticationParameters.iotCentral.aadParameters
                        )
                    )
                }
            />
        </div>
    );
};
