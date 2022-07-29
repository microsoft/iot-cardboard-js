import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import {
    DefaultButton,
    IStyle,
    ITextStyles,
    ITheme,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { DeeplinkContextProvider, useDeeplinkContext } from './DeeplinkContext';
import {
    DeeplinkContextActionType,
    IDeeplinkContextProviderProps,
    IDeeplinkContextState,
    IDeeplinkOptions
} from './DeeplinkContext.types';
import { ADT3DScenePageModes } from '../../Constants';
import { userEvent, within } from '@storybook/testing-library';
import { GET_MOCK_DEEPLINK_STATE } from './DeeplinkContext.mock';
import { useBoolean } from '@fluentui/react-hooks';

const defaultDeeplinkOptions: IDeeplinkOptions = {
    includeSelectedElement: true,
    includeSelectedLayers: true,
    excludeBaseUrl: true
};
const itemStackStyles: { root: IStyle } = {
    root: {
        alignItems: 'baseline',
        '> span': {
            paddingLeft: 4
        }
    } as IStyle
};
const headerStyles: React.CSSProperties = {
    marginBottom: 4,
    marginTop: 8
};
const getValueStyle = (theme: ITheme): ITextStyles => ({
    root: {
        color: theme.palette.neutralSecondary
    }
});
const getContainerStyles = (_theme: ITheme) => ({
    root: {
        padding: 8,
        border: `1px solid ${_theme.palette.neutralLight}`
    } as IStyle
});

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/DeeplinkContext',
    component: DeeplinkContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};
interface ProviderContentRendererProps {
    options: IDeeplinkOptions;
}
const ProviderContentRenderer: React.FC<ProviderContentRendererProps> = (
    props
) => {
    const { options } = props;
    const { deeplinkState, getDeeplink } = useDeeplinkContext();
    const theme = useTheme();
    const containerStyle = getContainerStyles(theme);
    const valueStyle = getValueStyle(theme);
    return (
        <Stack>
            <h4 style={headerStyles}>Context</h4>

            <Stack styles={containerStyle}>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>ADT URL: </Label>
                    <Text styles={valueStyle}>{deeplinkState?.adtUrl}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Storage URL: </Label>
                    <Text styles={valueStyle}>{deeplinkState?.storageUrl}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Mode: </Label>
                    <Text styles={valueStyle}>{deeplinkState?.mode}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>SceneId: </Label>
                    <Text styles={valueStyle}>{deeplinkState?.sceneId}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Selected element id: </Label>
                    <Text styles={valueStyle}>
                        {deeplinkState?.selectedElementId}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Selected layer ids: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(deeplinkState?.selectedLayerIds)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Deeplink: </Label>
                    <Text styles={valueStyle}>{getDeeplink(options)}</Text>
                </Stack>
            </Stack>
        </Stack>
    );
};

interface ProviderUpdaterProps {
    toggleIncludeElementIds: () => void;
    toggleIncludeLayerIds: () => void;
}
const ProviderUpdater: React.FC<ProviderUpdaterProps> = (props) => {
    const { toggleIncludeElementIds, toggleIncludeLayerIds } = props;

    const { deeplinkState, deeplinkDispatch } = useDeeplinkContext();
    const [adtUrlIncrementor, setAdtUrlIncrementor] = useState<number>(0);
    const [storageUrlIncrementor, setStorageUrlIncrementor] = useState<number>(
        0
    );
    const [sceneIdIncrementor, setSceneIdIncrementor] = useState<number>(0);
    const [elementIdIncrementor, setElementIdIncrementor] = useState<number>(0);
    const [layerIdIncrementor, setLayerIdIncrementor] = useState<number>(0);
    const theme = useTheme();
    return (
        <Stack>
            <h4 style={headerStyles}>Context Updates</h4>
            <Stack
                styles={getContainerStyles(theme)}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <DefaultButton
                    data-testid={'DeeplinkContext-ChangeAdtUrl'}
                    iconProps={{ iconName: 'Add' }}
                    text="Increment ADT url"
                    onClick={() => {
                        const newValue = adtUrlIncrementor + 1;
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_ADT_URL,
                            payload: {
                                url: deeplinkState.adtUrl.replace(
                                    adtUrlIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setAdtUrlIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-ChangeStorageUrl'}
                    iconProps={{ iconName: 'Add' }}
                    text="Increment storage url"
                    onClick={() => {
                        const newValue = storageUrlIncrementor + 1;
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_STORAGE_URL,
                            payload: {
                                url: deeplinkState.storageUrl.replace(
                                    storageUrlIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setStorageUrlIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-ChangeMode'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle mode"
                    onClick={() => {
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_MODE,
                            payload: {
                                mode:
                                    deeplinkState.mode ===
                                    ADT3DScenePageModes.BuildScene
                                        ? ADT3DScenePageModes.ViewScene
                                        : ADT3DScenePageModes.BuildScene
                            }
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-SceneId'}
                    text="Update scene id"
                    iconProps={{ iconName: 'Add' }}
                    onClick={() => {
                        const newValue = sceneIdIncrementor + 1;
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_SCENE_ID,
                            payload: {
                                sceneId: deeplinkState.sceneId.replace(
                                    sceneIdIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setSceneIdIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-SelectedElementId'}
                    iconProps={{ iconName: 'Add' }}
                    text="Update selected element"
                    onClick={() => {
                        const newValue = elementIdIncrementor + 1;
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_ELEMENT_ID,
                            payload: {
                                id: deeplinkState.selectedElementId.replace(
                                    elementIdIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setElementIdIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-AddLayer'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add layer"
                    onClick={() => {
                        const newValue = layerIdIncrementor + 1;
                        const newArray = [
                            ...deeplinkState.selectedLayerIds,
                            'newLayer-' + newValue
                        ];
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_LAYER_IDS,
                            payload: {
                                ids: newArray
                            }
                        });
                        setLayerIdIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-RemoveLayer'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove layer"
                    onClick={() => {
                        const newValue = layerIdIncrementor - 1;
                        const newArray = [...deeplinkState.selectedLayerIds];
                        newArray.pop();
                        deeplinkDispatch({
                            type: DeeplinkContextActionType.SET_LAYER_IDS,
                            payload: {
                                ids: newArray
                            }
                        });
                        setLayerIdIncrementor(newValue);
                    }}
                />
            </Stack>
            <h4 style={headerStyles}>Deeplink options</h4>
            <Stack
                styles={getContainerStyles(theme)}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <DefaultButton
                    data-testid={'DeeplinkContext-IncludeElementId'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle include element id"
                    onClick={() => {
                        toggleIncludeElementIds();
                    }}
                />
                <DefaultButton
                    data-testid={'DeeplinkContext-IncludeLayerIds'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle include layer ids"
                    onClick={() => {
                        toggleIncludeLayerIds();
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    defaultState: IDeeplinkContextState;
    deeplinkProps: IDeeplinkOptions;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IDeeplinkContextProviderProps>
) => {
    const [includeElementId, { toggle: toggleIncludeElementId }] = useBoolean(
        args.deeplinkProps?.includeSelectedElement
    );
    const [includeLayerIds, { toggle: toggleIncludeLayerIds }] = useBoolean(
        args.deeplinkProps?.includeSelectedElement
    );
    return (
        <DeeplinkContextProvider initialState={args.defaultState}>
            <Stack>
                <ProviderContentRenderer
                    options={{
                        ...args.deeplinkProps,
                        includeSelectedElement: includeElementId,
                        includeSelectedLayers: includeLayerIds
                    }}
                />
                <ProviderUpdater
                    toggleIncludeElementIds={toggleIncludeElementId}
                    toggleIncludeLayerIds={toggleIncludeLayerIds}
                />
            </Stack>
        </DeeplinkContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;

export const Empty = Template.bind({});
Empty.args = {
    deeplinkProps: {
        excludeBaseUrl: true
    }
} as StoryProps;

export const UpdateAdtUrl = Template.bind({});
UpdateAdtUrl.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
UpdateAdtUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeAdtUrl'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateStorageUrl = Template.bind({});
UpdateStorageUrl.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
UpdateStorageUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeStorageUrl'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateMode = Template.bind({});
UpdateMode.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
UpdateMode.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeMode'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateSceneId = Template.bind({});
UpdateSceneId.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
UpdateSceneId.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-SceneId'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateSelectedElement = Template.bind({});
UpdateSelectedElement.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
UpdateSelectedElement.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-SelectedElementId'
    );
    await userEvent.click(behaviorsTabButton);
};

export const AddLayer = Template.bind({});
AddLayer.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
AddLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-AddLayer'
    );
    await userEvent.click(behaviorsTabButton);
};

export const RemoveLayer = Template.bind({});
RemoveLayer.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
RemoveLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-RemoveLayer'
    );
    await userEvent.click(behaviorsTabButton);
};

export const ExcludeElementId = Template.bind({});
ExcludeElementId.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
ExcludeElementId.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-IncludeElementId'
    );
    await userEvent.click(behaviorsTabButton);
};

export const ExcludeLayerIds = Template.bind({});
ExcludeLayerIds.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE(),
    deeplinkProps: defaultDeeplinkOptions
} as StoryProps;
ExcludeLayerIds.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-IncludeLayerIds'
    );
    await userEvent.click(behaviorsTabButton);
};
