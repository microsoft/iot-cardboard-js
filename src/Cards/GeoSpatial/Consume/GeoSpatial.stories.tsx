import React, { useState } from 'react';
import MockAdapter from '../../../Adapters/MockAdapter';
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

export const Mock = (
    args,
    { globals: { theme, locale }, parameters: { wideCardWrapperStyle } }
) => {
    const [properties, setProperties] = useState({
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

/*NOT REALLY SURE YET WHAT THE DATA I NEED TO PUT IN HERE IS. I DO KNOW THE PURPOSE OF THIS FILE SEEMS TO BE
THAT THIS IS WHERE YOU MOCK PROPS, PARAMETERS, AND MOCK HOW THE ADAPTER METHOD WOULD WORK
*/
