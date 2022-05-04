import React from 'react';
import { ComponentStory } from '@storybook/react';
import {
    DefaultButton,
    IStyle,
    ITheme,
    Stack,
    useTheme
} from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { DebugContextProvider, useDebugContext } from '../DebugContext';
import { IDebugContextProviderProps } from '../DebugContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/DebugContext',
    component: DebugContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const getContainerStyles = (theme: ITheme) => ({
    root: {
        border: `1px solid ${theme.semanticColors.inputBorder}`,
        padding: 8
    } as IStyle
});

const ProviderUpdater: React.FC = () => {
    const { logDebug, logInfo, logWarn, logError } = useDebugContext();
    const theme = useTheme();
    return (
        <Stack
            styles={getContainerStyles(theme)}
            horizontal
            tokens={{ childrenGap: 8 }}
        >
            <DefaultButton
                data-testid={'DebugContext-Debug'}
                text="Log debug"
                onClick={() => {
                    logDebug('Debug message', { someobject: 'value' });
                }}
            />
            <DefaultButton
                data-testid={'DebugContext-Info'}
                text="Log info"
                onClick={() => {
                    logInfo('Info message', { someobject: 'value' });
                }}
            />
            <DefaultButton
                data-testid={'DebugContext-Warn'}
                text="Log warning"
                onClick={() => {
                    logWarn('Warning message', { someobject: 'value' });
                }}
            />
            <DefaultButton
                data-testid={'DebugContext-Error'}
                text="Log error"
                onClick={() => {
                    logError('Error message', { someobject: 'value' });
                }}
            />
        </Stack>
    );
};

type SceneBuilderStory = ComponentStory<typeof DebugContextProvider>;
const Template: SceneBuilderStory = (
    _args,
    _context: IStoryContext<IDebugContextProviderProps>
) => {
    return (
        <DebugContextProvider {..._args}>
            <Stack>
                <ProviderUpdater />
            </Stack>
        </DebugContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    context: 'Test component',
    enabled: true
} as IDebugContextProviderProps;

export const Empty = Template.bind({});
Empty.args = {} as IDebugContextProviderProps;
