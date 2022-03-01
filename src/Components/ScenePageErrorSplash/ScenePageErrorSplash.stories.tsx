import React from 'react';
import ScenePageErrorSplash from './ScenePageErrorSplash';

export default {
    title: 'ScenePageErrorSplash/Consume'
};

export const Foo = (args, { globals: { theme } }) => (
    <div style={{ height: '400px' }}>
        <ScenePageErrorSplash theme={theme} title={'ScenePageErrorSplash card'} />
    </div>
);
