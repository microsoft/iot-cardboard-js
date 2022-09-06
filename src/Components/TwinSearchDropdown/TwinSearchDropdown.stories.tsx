import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import { DTID_PROPERTY_NAME } from '../../Models/Constants/Constants';
import TwinSearchDropdown from './TwinSearchDropdown';

export default {
    title: 'Components/TwinSearchDropdown',
    component: TwinSearchDropdown
};

export const MockTwinSearchDropdown = () => {
    const handleSelectTwinId = (twinId) => {
        console.log('Selected: ' + twinId);
    };

    return (
        <div style={{ width: '400px' }}>
            <TwinSearchDropdown
                adapter={new MockAdapter()}
                isLabelHidden={true}
                onChange={handleSelectTwinId}
                searchPropertyName={DTID_PROPERTY_NAME}
            />
        </div>
    );
};
