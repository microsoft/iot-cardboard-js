import React from 'react';
import SceneListCard from './SceneListCard';
import useAuthParams from '../../../../.storybook/useAuthParams';
import MockAdapter from '../../../Adapters/MockAdapter';
import { ComponentErrorType } from '../../../Models/Constants';
import mockScenes from './mockData/mockScenes.json';

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
                adapter={new MockAdapter({ mockData: mockScenes })}
            />
        </div>
    );
};

export const Error = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();
    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div style={sceneListCardStyle}>
            <SceneListCard
                title={'Scene List Card'}
                theme={theme}
                locale={locale}
                adapter={
                    new MockAdapter({
                        mockError: ComponentErrorType.TokenRetrievalFailed
                    })
                }
            />
        </div>
    );
};
