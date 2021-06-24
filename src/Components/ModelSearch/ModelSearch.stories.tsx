import React from 'react';
import GithubModelSearchAdapter from '../../Adapters/GithubModelSearchAdapter';
import CdnModelSearchAdapter from '../../Adapters/CdnModelSearchAdapter';
import ModelSearch from './ModelSearch';

export default {
    title: 'Components/ModelSearch'
};

export const GithubModelSearch = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <ModelSearch
            adapter={
                new GithubModelSearchAdapter(
                    'https://devicemodels.azure.com',
                    'Azure/iot-plugandplay-models',
                    100
                )
            }
            onStandardModelSelection={(modelData) =>
                alert(JSON.stringify(modelData, null, 2))
            }
        />
    </div>
);

export const CdnModelSearch = () => (
    <div style={{ maxWidth: '720px', width: '100%' }}>
        <ModelSearch
            adapter={
                new CdnModelSearchAdapter(
                    'https://devicemodelstest.azure.com',
                    10
                )
            }
            onStandardModelSelection={(modelData) =>
                alert(JSON.stringify(modelData, null, 2))
            }
        />
    </div>
);
