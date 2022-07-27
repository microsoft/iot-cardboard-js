import {
    DefaultButton,
    IStyle,
    ITheme,
    Stack,
    useTheme
} from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import React, { useState } from 'react';
import { sleep } from '../../../Components/AutoComplete/AutoComplete';
import {
    IADTBackgroundColor,
    IADTObjectColor,
    ViewerObjectStyle
} from '../../Constants';

import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import {
    SceneThemeContextProvider,
    useSceneThemeContext
} from './SceneThemeContext';
import {
    SceneThemeContextActionType,
    ISceneThemeContextProviderProps
} from './SceneThemeContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/SceneThemeContext',
    component: SceneThemeContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const OBJECT_COLOR_OPTIONS: IADTObjectColor[] = [
    { color: 'red' } as IADTObjectColor,
    { color: 'green' } as IADTObjectColor,
    { color: 'blue' } as IADTObjectColor
];
const SCENE_BACKGROUND_OPTIONS: IADTBackgroundColor[] = [
    { color: 'purple' } as IADTBackgroundColor,
    { color: 'something' } as IADTBackgroundColor,
    { color: 'another' } as IADTBackgroundColor
];
const STYLE_OPTIONS: ViewerObjectStyle[] = [
    ViewerObjectStyle.Default,
    ViewerObjectStyle.Transparent,
    ViewerObjectStyle.Wireframe
];

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
const getContainerStyles = (_theme: ITheme) => ({
    root: {
        padding: 8,
        border: `1px solid ${_theme.palette.neutralLight}`
    } as IStyle
});

const ContextRenderer: React.FC = () => {
    const { sceneThemeState } = useSceneThemeContext();
    const containerStyle = getContainerStyles(useTheme());

    return (
        <Stack>
            <h4 style={headerStyles}>Context</h4>
            <Stack tokens={{ childrenGap: 8 }} styles={containerStyle}>
                <Stack horizontal styles={itemStackStyles}>
                    Object color: {sceneThemeState.objectColor?.color}
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    Object style: {sceneThemeState.objectStyle}
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    Scene background: {sceneThemeState.sceneBackground?.color}
                </Stack>
            </Stack>
        </Stack>
    );
};

const ContextUpdater: React.FC = () => {
    const { sceneThemeDispatch } = useSceneThemeContext();
    const [objectColorIndex, setObjectColorIndex] = useState<number>(0);
    const [objectStyleIndex, setObjectStyleIndex] = useState<number>(0);
    const [sceneBackgroundIndex, setSceneBackgroundIndex] = useState<number>(0);

    const onObjectColorClick = () => {
        const index = objectColorIndex + 1;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_OBJECT_COLOR,
            payload: {
                color:
                    OBJECT_COLOR_OPTIONS[index % OBJECT_COLOR_OPTIONS.length]
                        .color
            }
        });
        setObjectColorIndex(index);
    };
    const onStyleClick = () => {
        const index = objectStyleIndex + 1;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_OBJECT_STYLE,
            payload: {
                style: STYLE_OPTIONS[index % STYLE_OPTIONS.length]
            }
        });
        setObjectStyleIndex(index);
    };
    const onBackgroundClick = () => {
        const index = sceneBackgroundIndex + 1;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_SCENE_BACKGROUND,
            payload: {
                color:
                    SCENE_BACKGROUND_OPTIONS[
                        index % SCENE_BACKGROUND_OPTIONS.length
                    ].color
            }
        });
        setSceneBackgroundIndex(index);
    };
    return (
        <Stack>
            <h4 style={headerStyles}>Updates</h4>
            <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                styles={getContainerStyles(useTheme())}
            >
                <DefaultButton
                    data-testid={'scene-theme-context-change-color-button'}
                    onClick={onObjectColorClick}
                >
                    Change object color
                </DefaultButton>
                <DefaultButton
                    data-testid={'scene-theme-context-change-style-button'}
                    onClick={onStyleClick}
                >
                    Change object style
                </DefaultButton>
                <DefaultButton
                    data-testid={'scene-theme-context-change-background-button'}
                    onClick={onBackgroundClick}
                    text={'Change background color'}
                />
            </Stack>
        </Stack>
    );
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    _context: IStoryContext<ISceneThemeContextProviderProps>
) => {
    return (
        <SceneThemeContextProvider
            initialState={{
                objectColorOptions: OBJECT_COLOR_OPTIONS,
                sceneBackgroundOptions: SCENE_BACKGROUND_OPTIONS
            }}
            shouldPersistTheme={false}
        >
            <ContextRenderer />
            <ContextUpdater />
        </SceneThemeContextProvider>
    );
};

export const Base = Template.bind({});

export const UpdateObjectColor = Template.bind({});
UpdateObjectColor.play = async ({ canvasElement }) => {
    await sleep(1);
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'scene-theme-context-change-color-button'
    );
    userEvent.click(behaviorsTabButton);
};

export const UpdateObjectStyle = Template.bind({});
UpdateObjectStyle.play = async ({ canvasElement }) => {
    await sleep(1);
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'scene-theme-context-change-style-button'
    );
    userEvent.click(behaviorsTabButton);
};

export const UpdateBackgroundColor = Template.bind({});
UpdateBackgroundColor.play = async ({ canvasElement }) => {
    await sleep(1);
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'scene-theme-context-change-background-button'
    );
    userEvent.click(behaviorsTabButton);
};
