import React from 'react';
import TestImg from '../../Resources/Static/test.svg';
import { ReactComponent as AccessRestricted } from '../../Resources/Static/accessRestricted.svg';

const SvgTest = () => {
    return (
        <div
            className="cb-svg-test-wrapper"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <h3>Test SVG icon via img tag src</h3>
            <img src={TestImg} style={{ width: 50, height: 50 }} />
            <h3>Test SVG illustration via React component syntax</h3>
            <AccessRestricted />
        </div>
    );
};

export default SvgTest;
