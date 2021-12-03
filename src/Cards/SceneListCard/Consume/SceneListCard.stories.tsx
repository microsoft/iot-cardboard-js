import React from 'react';
import { MockAdapter } from '../../../Adapters';
import SceneListCard from './SceneListCard';
import mockScenes from './mockData/mockScenes.json';

export default {
    title: 'SceneListCard/Consume/Mock'
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
                adapter={new MockAdapter({ mockData: mockScenes })}
            />
        </div>
    );
};
