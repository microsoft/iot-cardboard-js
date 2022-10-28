import React from 'react';
import OATEditorPage from './OATEditorPage';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Models/Services/StoryUtilities';
import { ComponentStory } from '@storybook/react';

const wrapperStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'absolute'
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
            theme={context.parameters.theme || context.globals.theme}
            locale={context.globals.locale}
            localeStrings={context.globals.locale}
        />
    );
};

export const OATModelEditorPage = Template.bind({});
