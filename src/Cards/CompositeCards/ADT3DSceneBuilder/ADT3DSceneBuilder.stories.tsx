import React from 'react';
import MockAdapter from '../../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import mockVConfig from '../../../Adapters/__mockData__/vconfigDecFinal.json';
import TwinSearchDropdown from './Components/Elements/TwinSearchDropdown';

export default {
    title: 'CompositeCards/ADT3DSceneBuilder'
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

export const Mock3DSceneBuilder = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={cardStyle}>
            <ADT3DSceneBuilder
                title={'3D Scene Builder'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: mockVConfig })}
                sceneId="58e02362287440d9a5bf3f8d6d6bfcf9"
            />
        </div>
    );
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
