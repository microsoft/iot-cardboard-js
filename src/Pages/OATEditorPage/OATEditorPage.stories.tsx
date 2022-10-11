import React from 'react';
import OATEditorPage from './OATEditorPage';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { ComponentStory } from '@storybook/react';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 8
};
export default {
    title: 'Pages/OATEditorPage',
    component: OATEditorPage,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    context: IStoryContext<any>
) => {
    return (
        <OATEditorPage
            selectedTheme={context.parameters.theme || context.globals.theme}
        />
    );
};

export const OATModelEditorPage = Template.bind({});
