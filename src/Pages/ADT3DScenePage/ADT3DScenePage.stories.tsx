import React, { useCallback } from 'react';
import MockAdapter from '../../Adapters/MockAdapter';
import ADT3DScenePage from './ADT3DScenePage';
import mockConfig from '../../Adapters/__mockData__/3DScenesConfiguration.json';
import demoEnvsConfig from '../../Adapters/__mockData__/DemoEnvsConfig.json';
import demoEnvsTwins from '../../Adapters/__mockData__/MockAdapterData/DemoEnvsTwinData.json';
import demoEnvsModels from '../../Adapters/__mockData__/MockAdapterData/DemoEnvsModelData.json';
import { deepCopy } from '../../Models/Services/Utils';
import { DeeplinkContextProvider } from '../../Models/Context/DeeplinkContext/DeeplinkContext';
import { IDeeplinkContextState } from '../../Models/Context/DeeplinkContext/DeeplinkContext.types';
import {
    ADT3DScenePageModes,
    DtdlInterface,
    IADTTwin
} from '../../Models/Constants';
import { I3DScenesConfig } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    IStackStyles,
    ITextFieldStyles,
    Stack,
    TextField
} from '@fluentui/react';
import { SceneThemeContextProvider } from '../../Models/Context';
import { useSceneThemeContext } from '../../Models/Context/SceneThemeContext/SceneThemeContext';
import { SceneThemeContextActionType } from '../../Models/Context/SceneThemeContext/SceneThemeContext.types';

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
                enableTwinPropertyInspectorPatchMode
            />
        </div>
    );
};
Mock3DScenePage.storyName = 'Mock 3D scene page';

export const DeeplinkedViewer = (_args, { globals: { theme, locale } }) => {
    const deeplinkState: IDeeplinkContextState = {
        adtUrl: 'https://mockAdt.api.wcus.digitaltwins.azure.net',
        adtResourceId: '',
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
                    enableTwinPropertyInspectorPatchMode
                />
            </DeeplinkContextProvider>
        </div>
    );
};
DeeplinkedViewer.storyName = 'Mock 3D scene page (Deeplinked Viewer)';

export const DeeplinkedBuilder = (_args, { globals: { theme, locale } }) => {
    const deeplinkState: IDeeplinkContextState = {
        adtUrl: 'https://mockAdt.api.wcus.digitaltwins.azure.net',
        adtResourceId: '',
        mode: ADT3DScenePageModes.BuildScene,
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
DeeplinkedBuilder.storyName = 'Mock 3D scene page (Deeplinked Builder)';

const customSceneStyles: IStackStyles = {
    root: {
        '.cb-scene-page-wrapper': {
            height: 'calc(100vh - 300px)'
        }
    }
};
const textFieldStyles: Partial<ITextFieldStyles> = {
    root: {
        width: 500
    }
};
const ThemeCustomizationContent: React.FC<{ theme; locale }> = ({
    theme,
    locale
}) => {
    const { sceneThemeDispatch, sceneThemeState } = useSceneThemeContext();
    const onChangeColorOptions = useCallback(
        (_e: any, value: string) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_OBJECT_COLOR_OPTIONS,
                payload: {
                    options: JSON.parse(value)
                }
            });
        },
        [sceneThemeDispatch]
    );
    const onChangeStyleOptions = useCallback(
        (_e: any, value: string) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_OBJECT_STYLE_OPTIONS,
                payload: {
                    options: JSON.parse(value)
                }
            });
        },
        [sceneThemeDispatch]
    );
    const onChangeBackgroundOptions = useCallback(
        (_e: any, value: string) => {
            sceneThemeDispatch({
                type: SceneThemeContextActionType.SET_SCENE_BACKGROUND_OPTIONS,
                payload: {
                    options: JSON.parse(value)
                }
            });
        },
        [sceneThemeDispatch]
    );
    return (
        <Stack>
            <Stack styles={customSceneStyles}>
                <ADT3DScenePage
                    title={'3D Scene Page'}
                    theme={theme}
                    locale={locale}
                    adapter={new MockAdapter({ mockData: mockConfig })}
                />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 8 }}>
                <TextField
                    label={'Object color options'}
                    multiline
                    onChange={onChangeColorOptions}
                    value={JSON.stringify(sceneThemeState.objectColorOptions)}
                    styles={textFieldStyles}
                />
                <TextField
                    label={'Object style options'}
                    multiline
                    onChange={onChangeStyleOptions}
                    value={JSON.stringify(sceneThemeState.objectStyleOptions)}
                    styles={textFieldStyles}
                />
                <TextField
                    label={'Background color options'}
                    multiline
                    onChange={onChangeBackgroundOptions}
                    value={JSON.stringify(
                        sceneThemeState.sceneBackgroundOptions
                    )}
                    styles={textFieldStyles}
                />
            </Stack>
        </Stack>
    );
};
export const ThemeCustomization = (_args, { globals: { theme, locale } }) => {
    const deeplinkState: IDeeplinkContextState = {
        adtUrl: 'https://mockAdt.api.wcus.digitaltwins.azure.net',
        adtResourceId: '',
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
                <SceneThemeContextProvider initialState={{}}>
                    <ThemeCustomizationContent theme={theme} locale={locale} />
                </SceneThemeContextProvider>
            </DeeplinkContextProvider>
        </div>
    );
};
ThemeCustomization.storyName = 'Mock 3D scene page (Theme customizer)';

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

export const Mock3DScenePageDemoEnvs = (
    _args,
    { globals: { theme, locale } }
) => {
    const adapter = new MockAdapter();
    adapter.scenesConfig = demoEnvsConfig as I3DScenesConfig;
    adapter.mockTwins = demoEnvsTwins as IADTTwin[];
    adapter.mockModels = demoEnvsModels as DtdlInterface[];

    return (
        <div style={cardStyle}>
            <ADT3DScenePage
                title={'3D Scene Page'}
                theme={theme}
                locale={locale}
                adapter={adapter}
            />
        </div>
    );
};

Mock3DScenePageDemoEnvs.storyName = 'Mock 3D scene page (Demo Environments)';
