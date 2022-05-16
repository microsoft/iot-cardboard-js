import { DefaultButton, Label, Stack, Text } from '@fluentui/react';
import { ComponentStory } from '@storybook/react';
import React, { useRef } from 'react';
import { ViewerMode } from '../../../Components/ModelViewerModePicker/ModelViewerModePicker';
import { ViewerModeStyles } from '../../Constants';

import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { use3DColorContext } from '../3DColorContext/3DColorContext';
import { _3DColorContextProvider } from './3DColorContext';
import { I3DColorContextProviderProps } from './3DColorContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/3DColorContext',
    component: _3DColorContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ContextRenderer: React.FC = () => {
    const { onOverrideColors } = use3DColorContext();

    const onClick = () => {
        alert('renderer hit');
        onOverrideColors({} as any);
    };
    return (
        <Stack tokens={{ childrenGap: 8 }}>
            Hello World
            <DefaultButton onClick={onClick}>BUTTON PRESS ME</DefaultButton>
        </Stack>
    );
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    _context: IStoryContext<I3DColorContextProviderProps>
) => {
    const overrideColors = (overrideViewMode: ViewerMode) => {
        alert('BUTTON PRESSED GOOD JOB');
        return 'objectColor';
    };
    return (
        <_3DColorContextProvider onOverrideColors={overrideColors}>
            <ContextRenderer />
        </_3DColorContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    primary: 'true',
    label: 'Button'
};
