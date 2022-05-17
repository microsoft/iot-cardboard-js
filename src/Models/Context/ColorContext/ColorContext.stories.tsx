import { DefaultButton, Stack } from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import React, { useState } from 'react';
import { ViewerObjectStyle } from '../../Constants';

import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import {
    ColorContextProvider,
    useColorContext
} from '../ColorContext/ColorContext';
import {
    ColorContextActionType,
    IColorContextProviderProps
} from './ColorContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/ColorContext',
    component: ColorContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const OBJECT_COLOR_OPTIONS: string[] = ['red', 'green', 'blue'];
const SCENE_BACKGROUND_OPTIONS: string[] = ['pruple', 'something', 'another'];
const STYLE_OPTIONS: ViewerObjectStyle[] = [
    ViewerObjectStyle.Default,
    ViewerObjectStyle.Transparent,
    ViewerObjectStyle.Wireframe
];

const ContextRenderer: React.FC = () => {
    const { colorState } = useColorContext();

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <div>Context state</div>
            <div>Object color: {colorState.objectColor}</div>
            <div>Object style: {colorState.objectStyle}</div>
            <div>Scene background: {colorState.sceneBackground}</div>
        </Stack>
    );
};

const ContextUpdater: React.FC = () => {
    const { colorDispatch } = useColorContext();
    const [objectColorIndex, setObjectColorIndex] = useState<number>(0);
    const [objectStyleIndex, setObjectStyleIndex] = useState<number>(0);
    const [sceneBackgroundIndex, setSceneBackgroundIndex] = useState<number>(0);

    const onObjectColorClick = () => {
        const index = objectColorIndex;
        colorDispatch({
            type: ColorContextActionType.SET_OBJECT_COLOR,
            payload: {
                color: OBJECT_COLOR_OPTIONS[index % OBJECT_COLOR_OPTIONS.length]
            }
        });
        setObjectColorIndex(index + 1);
    };
    const onStyleClick = () => {
        const index = objectStyleIndex;
        colorDispatch({
            type: ColorContextActionType.SET_OBJECT_STYLE,
            payload: {
                style: STYLE_OPTIONS[index % STYLE_OPTIONS.length]
            }
        });
        setObjectStyleIndex(index + 1);
    };
    const onBackgroundClick = () => {
        const index = sceneBackgroundIndex;
        colorDispatch({
            type: ColorContextActionType.SET_SCENE_BACKGROUND,
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
        <Stack horizontal tokens={{ childrenGap: 8 }}>
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
    );
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    _context: IStoryContext<IColorContextProviderProps>
) => {
    return (
        <ColorContextProvider>
            <ContextRenderer />
            <ContextUpdater />
        </ColorContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    primary: 'true',
    label: 'Button'
};
