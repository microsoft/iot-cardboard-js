import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import mockConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage
};

const cardStyle = {
    height: '600px',
    width: '100%'
};

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
    const invalidConfig = JSON.parse(JSON.stringify(mockConfig));
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
