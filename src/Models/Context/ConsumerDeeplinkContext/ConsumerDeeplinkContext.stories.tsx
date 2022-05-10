import React, { useRef } from 'react';
import queryString from 'query-string';
import { ComponentStory } from '@storybook/react';
import { DefaultButton, Label, Stack, Text } from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { ConsumerDeeplinkContextProvider } from './ConsumerDeeplinkContext';
import { IConsumerDeeplinkContextProviderProps } from './ConsumerDeeplinkContext.types';
import {
    DeeplinkContextProvider,
    useDeeplinkContext
} from '../DeeplinkContext/DeeplinkContext';
import { GET_MOCK_DEEPLINK_STATE } from '../DeeplinkContext/DeeplinkContext.mock';
import { useBoolean } from '@fluentui/react-hooks';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/ConsumerDeeplinkContext',
    component: ConsumerDeeplinkContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ContextRenderer: React.FC = () => {
    // force a render cause we fetch the deeplink on each render
    const [_forceRender, { toggle: toggleRender }] = useBoolean(false);
    const { getDeeplink } = useDeeplinkContext();
    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <Stack
                horizontal
                styles={{ root: { alignItems: 'center' } }}
                tokens={{ childrenGap: 8 }}
            >
                <Label>Deeplink: </Label>
                <Text>
                    {getDeeplink({
                        includeSelectedElement: false,
                        includeSelectedLayers: false,
                        excludeBaseUrl: true
                    })}
                </Text>
            </Stack>
            <DefaultButton onClick={toggleRender}>Generate link</DefaultButton>
        </Stack>
    );
};

type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    _args: any,
    _context: IStoryContext<IConsumerDeeplinkContextProviderProps>
) => {
    const countRef = useRef(0);
    const onLinkGenerated = (link: string) => {
        countRef.current++;
        const customQsps = {
            customParam: countRef.current
        };
        const newLink = queryString.stringifyUrl(
            { url: link, query: { ...customQsps } },
            {
                encode: true,
                sort: false,
                skipEmptyString: true
            }
        );
        return newLink;
    };

    return (
        <ConsumerDeeplinkContextProvider onGenerateDeeplink={onLinkGenerated}>
            <DeeplinkContextProvider initialState={GET_MOCK_DEEPLINK_STATE()}>
                <ContextRenderer />
            </DeeplinkContextProvider>
        </ConsumerDeeplinkContextProvider>
    );
};

export const Base = Template.bind({});
