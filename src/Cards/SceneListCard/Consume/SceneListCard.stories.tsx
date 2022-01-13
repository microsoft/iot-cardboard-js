import React from 'react';
import SceneListCard from './SceneListCard';
import MockAdapter from '../../../Adapters/MockAdapter';
import mockVConfig from '../../../Adapters/__mockData__/vconfigDecFinal.json';

export default {
    title: 'SceneListCard/Consume'
};

const sceneListCardStyle = {
    height: '100%'
};

export const Mock = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={sceneListCardStyle}>
            <SceneListCard
                title={'Mock Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: mockVConfig })}
            />
        </div>
    );
};
