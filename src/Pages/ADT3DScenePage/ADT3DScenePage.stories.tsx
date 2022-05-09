import React from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import mockConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import { deepCopy } from '../../Models/Services/Utils';
import { DeeplinkContextProvider } from '../../Models/Context/DeeplinkContext';
import { IDeeplinkContextState } from '../../Models/Context/DeeplinkContext.types';
import { ADT3DScenePageModes } from '../../Models/Constants';

export default {
    title: 'Pages/ADT3DScenePage',
    component: ADT3DScenePage,
    parameters: {
        noGlobalWrapper: true,
        layout: 'fullscreen'
    },
    chromatic: {
        delay: 1000
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

export const Deeplinked = (_args, { globals: { theme, locale } }) => {
    const deeplinkState: IDeeplinkContextState = {
        adtUrl: 'https://mockAdt.api.wcus.digitaltwins.azure.net',
        mode: ADT3DScenePageModes.ViewScene,
        sceneId: 'f7053e7537048e03be4d1e6f8f93aa8a',
        selectedElementId: '45131a84754280b924477f1df54ca547',
        selectedLayerIds: [
            '8904b620aa83c649888dadc7c8fdf492',
            '9624b620aa83c649888dadc7c8fdf541'
        ],
        storageUrl:
            'https://mockStorageAccountName.blob.core.windows.net/mockContainer'
    };
    return (
        <div style={cardStyle}>
            <DeeplinkContextProvider initialState={deeplinkState}>
                <ADT3DScenePage
                    title={'3D Scene Page'}
                    theme={theme}
                    locale={locale}
                    adapter={new MockAdapter({ mockData: mockConfig })}
                />
            </DeeplinkContextProvider>
        </div>
    );
};
Deeplinked.storyName = 'Mock 3D scene page (Deeplinked)';

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
