import React from 'react';
import useAuthParams from '../../../../.storybook/useAuthParams';
import MockAdapter from '../../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import { mockVConfig } from '../../SceneListCard/Consume/__mockData__/vconfigDecFinal';

export default {
    title: 'CompositeCards/ADT3DScenePage'
};

const cardStyle = {
    height: '800px',
    width: '100%'
};

export const ADT3DScenePageCard = (_args, { globals: { theme, locale } }) => {
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
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
