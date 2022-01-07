import React from 'react';
import MockAdapter from '../../../Adapters/MockAdapter';
import ADT3DSceneBuilder from './ADT3DSceneBuilder';
import { mockVConfig } from '../../../Adapters/__mockData__/vconfigDecFinal';

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
            />
        </div>
    );
};
