import {
    DefaultButton,
    IStyle,
    ITheme,
    Stack,
    useTheme
} from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { ViewerObjectStyle } from '../../Constants';

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

const OBJECT_COLOR_OPTIONS: string[] = ['red', 'green', 'blue'];
const SCENE_BACKGROUND_OPTIONS: string[] = ['pruple', 'something', 'another'];
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
                    Object color: {sceneThemeState.objectColor}
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    Object style: {sceneThemeState.objectStyle}
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    Scene background: {sceneThemeState.sceneBackground}
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
        const index = objectColorIndex;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_OBJECT_COLOR,
            payload: {
                color: OBJECT_COLOR_OPTIONS[index % OBJECT_COLOR_OPTIONS.length]
            }
        });
        setObjectColorIndex(index + 1);
    };
    const onStyleClick = () => {
        const index = objectStyleIndex;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_OBJECT_STYLE,
            payload: {
                style: STYLE_OPTIONS[index % STYLE_OPTIONS.length]
            }
        });
        setObjectStyleIndex(index + 1);
    };
    const onBackgroundClick = () => {
        const index = sceneBackgroundIndex;
        sceneThemeDispatch({
            type: SceneThemeContextActionType.SET_SCENE_BACKGROUND,
            payload: {
                color:
                    SCENE_BACKGROUND_OPTIONS[
                        index % SCENE_BACKGROUND_OPTIONS.length
                    ]
            }
        });
        setSceneBackgroundIndex(index + 1);
    };
    return (
        <Stack>
            <h4 style={headerStyles}>Updates</h4>
            <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                styles={getContainerStyles(useTheme())}
            >
                <DefaultButton onClick={onObjectColorClick}>
                    Change object color
                </DefaultButton>
                <DefaultButton onClick={onStyleClick}>
                    Change object style
                </DefaultButton>
                <DefaultButton onClick={onBackgroundClick}>
                    Change background color
                </DefaultButton>
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
        <SceneThemeContextProvider>
            <ContextRenderer />
            <ContextUpdater />
        </SceneThemeContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    primary: 'true',
    label: 'Button'
};
