import React from 'react';
import SceneListCard from './SceneListCard';
import useAuthParams from '../../../../.storybook/useAuthParams';
import { MockAdapter } from '../../../Adapters';
import mockVConfig from './mockData/vconfig-MattReworkFusionChristian.json';

export default {
    title: 'SceneListCard/Consume'
};

const sceneListCardStyle = {
    height: '100%'
};

export const SceneCard = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={sceneListCardStyle}>
            <SceneListCard
                title={'Scene List Card'}
                theme={theme}
                locale={locale}
                // TODO: replace with new blob adapter
                adapter={new MockAdapter({ mockData: mockVConfig })}
                id={''}
                properties={[]}
            />
        </div>
    );
};
