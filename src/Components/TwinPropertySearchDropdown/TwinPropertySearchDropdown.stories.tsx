import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import { DTID_PROPERTY_NAME } from '../../Models/Constants/Constants';
import TwinPropertySearchDropdown from './TwinPropertySearchDropdown';

export default {
    title: 'Components/TwinPropertySearchDropdown',
    component: TwinPropertySearchDropdown
};

export const MockBase = () => {
    const handleSelectTwinId = (twinId) => {
        console.log('Selected: ' + twinId);
    };

    return (
        <div style={{ width: '400px' }}>
            <TwinPropertySearchDropdown
                adapter={new MockAdapter()}
                isLabelHidden={true}
                onChange={handleSelectTwinId}
                searchPropertyName={DTID_PROPERTY_NAME}
            />
        </div>
    );
};
