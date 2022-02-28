import React from 'react';
import TestImg from '../../Resources/Static/test.svg';
import AccessRestricted from '../../Resources/Static/accessRestricted.svg';

const SvgTest = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3>Test SVG icon</h3>
            <TestImg />
            <h3>Test SVG illustration</h3>
            <AccessRestricted />
        </div>
    );
};

export default SvgTest;
