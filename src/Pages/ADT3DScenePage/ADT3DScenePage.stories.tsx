import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import mockConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { deepCopy } from '../../Models/Services/Utils';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage,
    parameters: {
        noGlobalWrapper: true,
        layout: 'fullscreen'
    }
};

const cardStyle = {
    height: '100%',
    width: '100%',
    position: 'absolute'
} as React.CSSProperties;

export const Mock3DScenePage = (_args, { globals: { theme, locale } }) => {
    return (
        <div style={cardStyle}>
            <ADT3DScenePage
                title={'3D Scene Page'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: mockConfig })}
            />
        </div>
    );
};

Mock3DScenePage.storyName = 'Mock 3D scene page';

export const Mock3DScenePageSchemaErrors = (
    _args,
    { globals: { theme, locale } }
) => {
    const invalidConfig = deepCopy(mockConfig);
    invalidConfig.configuration.scenes[0]['invalidPropTest'] = 'uh oh';

    return (
        <div style={cardStyle}>
            <ADT3DScenePage
                title={'3D Scene Page'}
                theme={theme}
                locale={locale}
                adapter={new MockAdapter({ mockData: invalidConfig })}
            />
        </div>
    );
};

Mock3DScenePageSchemaErrors.storyName = 'Mock 3D scene page (invalid config)';
