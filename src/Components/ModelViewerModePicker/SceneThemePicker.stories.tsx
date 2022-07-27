import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import React from 'react';
import { SceneThemeContextProvider } from '../../Models/Context';
import { useSceneThemeContext } from '../../Models/Context/SceneThemeContext/SceneThemeContext';
import {
    getDefaultStoryDecorator,
    waitForFirstRender
} from '../../Models/Services/StoryUtilities';
import ModelViewerModePicker from './ModelViewerModePicker';
import SceneThemePicker from './SceneThemePicker';

const wrapperStyle = { width: 'auto', height: 'auto', padding: 8 };
export default {
    title: 'Components/SceneThemePicker',
    component: ModelViewerModePicker,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const InnerContents: React.FC = () => {
    const { sceneThemeState } = useSceneThemeContext();
    return (
        <>
            <div style={{ marginBottom: '30px' }}>
                <div>
                    <span>Style: </span>
                    <span>{sceneThemeState?.objectStyle}</span>
                </div>
                <div>
                    <span>Object color: </span>
                    <span>{sceneThemeState?.objectColor?.color}</span>
                </div>
                <div>
                    <span>Background: </span>
                    <span>{sceneThemeState?.sceneBackground?.color}</span>
                </div>
            </div>
            <SceneThemePicker />
        </>
    );
};
type TemplateStory = ComponentStory<typeof SceneThemePicker>;

const Template: React.FC = () => {
    return (
        <SceneThemeContextProvider>
            <InnerContents />
        </SceneThemeContextProvider>
    );
};

export const Base = Template.bind({}) as TemplateStory;
Base.args = {};

export const Opened = Template.bind({}) as TemplateStory;
Opened.play = async ({ canvasElement }) => {
    await waitForFirstRender();
    const canvas = within(canvasElement);
    const menuItem = canvas.getByTestId('scene-theme-picker-button');
    await userEvent.click(menuItem);
};
