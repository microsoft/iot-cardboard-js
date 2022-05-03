import React, { CSSProperties, useState } from 'react';
import { ComponentStory } from '@storybook/react';
import {
    DefaultButton,
    IStyle,
    ITheme,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { DeeplinkContextProvider, useDeeplinkContext } from './DeeplinkContext';
import {
    DeeplinkContextActionType,
    IDeeplinkContextProviderProps
} from './DeeplinkContext.types';
import { ADT3DScenePageModes } from '../Constants';
import { userEvent, within } from '@storybook/testing-library';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    // height: '400px',
    padding: 10
};
export default {
    title: 'Contexts/DeeplinkContext',
    component: DeeplinkContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const itemStackStyles: { root: IStyle } = {
    root: {
        alignItems: 'baseline',
        '> span': {
            paddingLeft: 4
        }
    } as IStyle
};
const getContainerStyles = (theme: ITheme) => ({
    root: {
        border: `1px solid ${theme.semanticColors.inputBorder}`,
        padding: 8
    } as IStyle
});
const ProviderContentRenderer: React.FC = () => {
    const { deeplinkState } = useDeeplinkContext();
    const theme = useTheme();
    return (
        <Stack styles={getContainerStyles(theme)}>
            <Stack horizontal styles={itemStackStyles}>
                <Label>ADT URL: </Label>
                <Text>{deeplinkState?.adtUrl}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>Storage URL: </Label>
                <Text>{deeplinkState?.storageUrl}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>Mode: </Label>
                <Text>{deeplinkState?.mode}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>SceneId: </Label>
                <Text>{deeplinkState?.sceneId}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>Selected element id: </Label>
                <Text>{deeplinkState?.selectedElementId}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>Selected layer ids: </Label>
                <Text>{JSON.stringify(deeplinkState?.selectedLayerIds)}</Text>
            </Stack>
            <Stack horizontal styles={itemStackStyles}>
                <Label>Deeplink: </Label>
                <Text>{deeplinkState?.deeplink}</Text>
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
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
        <Stack
            styles={getContainerStyles(theme)}
            horizontal
            tokens={{ childrenGap: 8 }}
        >
            <DefaultButton
                data-testid={'DeeplinkContext-ChangeAdtUrl'}
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
                text="Increment storage url"
                onClick={() => {
                    const newValue = storageUrlIncrementor + 1;
                    deeplinkDispatch({
                        type: DeeplinkContextActionType.SET_STORAGE_URL,
                        payload: {
                            url: deeplinkState.adtUrl.replace(
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
    );
};

type SceneBuilderStory = ComponentStory<typeof DeeplinkContextProvider>;
const Template: SceneBuilderStory = (
    _args,
    _context: IStoryContext<IDeeplinkContextProviderProps>
) => {
    return (
        <DeeplinkContextProvider {..._args}>
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </DeeplinkContextProvider>
    );
};

const getDefaultState = (): IDeeplinkContextProviderProps => ({
    initialState: {
        adtUrl: 'https://myurl.adt-0',
        mode: ADT3DScenePageModes.BuildScene,
        sceneId: 'scene id-0',
        selectedElementId: 'some element-0',
        selectedLayerIds: ['someLayerId-0'],
        storageUrl: 'https://storageUrl'
    }
});

export const Base = Template.bind({});
Base.args = getDefaultState();

export const Empty = Template.bind({});
Empty.args = {} as IDeeplinkContextProviderProps;

export const UpdateAdtUrl = Template.bind({});
UpdateAdtUrl.args = getDefaultState();
UpdateAdtUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeAdtUrl'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateStorageUrl = Template.bind({});
UpdateStorageUrl.args = getDefaultState();
UpdateStorageUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeStorageUrl'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateMode = Template.bind({});
UpdateMode.args = getDefaultState();
UpdateMode.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-ChangeMode'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateSceneId = Template.bind({});
UpdateSceneId.args = getDefaultState();
UpdateSceneId.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-SceneId'
    );
    await userEvent.click(behaviorsTabButton);
};

export const UpdateSelectedElement = Template.bind({});
UpdateSelectedElement.args = getDefaultState();
UpdateSelectedElement.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-SelectedElementId'
    );
    await userEvent.click(behaviorsTabButton);
};

export const AddLayer = Template.bind({});
AddLayer.args = getDefaultState();
AddLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-AddLayer'
    );
    await userEvent.click(behaviorsTabButton);
};

export const RemoveLayer = Template.bind({});
RemoveLayer.args = getDefaultState();
RemoveLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'DeeplinkContext-RemoveLayer'
    );
    await userEvent.click(behaviorsTabButton);
};
