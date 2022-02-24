import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
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
                onTwinIdSelect={handleSelectTwinId}
            />
        </div>
    );
};
