import React from 'react';
import SceneListCard from './SceneListCard';
import useAuthParams from '../../../../.storybook/useAuthParams';
import MockAdapter from '../../../Adapters/MockAdapter';
import { CardErrorType } from '../../../Models/Constants';

export default {
    title: 'SceneListCard/Consume'
};

const sceneListCardStyle = {
    height: '100%'
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
                        mockError: CardErrorType.TokenRetrievalFailed
                    })
                }
            />
        </div>
    );
};
