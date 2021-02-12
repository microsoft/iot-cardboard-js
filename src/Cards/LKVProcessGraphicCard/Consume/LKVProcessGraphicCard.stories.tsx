import React from 'react';
import IoTCentralAdapter from '../../../Adapters/IoTCentralAdapter';
import MsalAuthService from '../../../Helpers/MsalAuthService';
import LKVProcessGraphicCard from './LKVProcessGraphicCard';

export default {
    title: 'LKVProcessGraphic/Consume'
};

const chartCardStyle = {
    height: '400px',
    width: '720px'
};

export const IoTCLKVPG = (args, { globals: { theme } }) => {
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
    return (
        <div style={chartCardStyle}>
            <LKVProcessGraphicCard
                id={iotcId}
                imageSrc="http://www.pngall.com/wp-content/uploads/2016/09/Cargo-Truck-Download-PNG.png"
                pollingIntervalMillis={5000}
                properties={iotcProperties}
                additionalProperties={propertyPositions}
                title={'Real-time Truck Status'}
                theme={theme}
                adapter={
                    new IoTCentralAdapter(
                        'logistics-companion.azureiotcentral.com',
                        new MsalAuthService({
                            authority:
                                'https://login.microsoftonline.com/e56f6d88-b263-4dae-9ade-5668d4e974fb',
                            clientId: '91a64ae0-e4a0-4ea9-864d-275c60afff39',
                            scope:
                                'https://apps.azureiotcentral.com/user_impersonation',
                            redirectUri: 'http://localhost:3001'
                        })
                    )
                }
            />
        </div>
    );
};
