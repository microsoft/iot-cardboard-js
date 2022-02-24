import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import mockVConfig from '../../Adapters/__mockData__/vconfigDecFinal.json';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

export const Mock3DScenePageCard = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={cardStyle}>
            <ADT3DScenePage
                title={'3D Scene Page'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: mockVConfig })}
            />
        </div>
    );
};
