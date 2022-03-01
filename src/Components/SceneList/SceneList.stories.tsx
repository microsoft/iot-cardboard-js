import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import mockVConfig from '../../Adapters/__mockData__/vconfigDecFinal.json';
import SceneList from './SceneList';

export default {
    title: 'Components/SceneList'
};

const SceneListStyle = {
    height: '100%'
};

export const Mock = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={SceneListStyle}>
            <SceneList
                title={'Mock Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: mockVConfig })}
            />
        </div>
    );
};
