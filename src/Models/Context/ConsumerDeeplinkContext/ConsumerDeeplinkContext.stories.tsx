import React, { useRef } from 'react';
import queryString from 'query-string';
import { ComponentStory } from '@storybook/react';
import { DefaultButton, Label, Stack, Text } from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { ConsumerDeeplinkContext } from './ConsumerDeeplinkContext';
import { IConsumerDeeplinkContextProviderProps } from './ConsumerDeeplinkContext.types';
import {
    DeeplinkContextProvider,
    useDeeplinkContext
} from '../DeeplinkContext/DeeplinkContext';
import { GET_MOCK_DEEPLINK_STATE } from '../DeeplinkContext/DeeplinkContext.mock';
import { useBoolean } from '@fluentui/react-hooks';
import { DEEPLINK_SERIALIZATION_OPTIONS } from '../DeeplinkContext/DeeplinkContext.types';

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 10
};
export default {
    title: 'Contexts/ConsumerDeeplinkContext',
    component: ConsumerDeeplinkContext,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ContextRenderer: React.FC = () => {
    // force a render cause we fetch the deeplink on each render
    const [, { toggle: toggleRender }] = useBoolean(false);
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
            DEEPLINK_SERIALIZATION_OPTIONS
        );
        return newLink;
    };

    return (
        <ConsumerDeeplinkContext onGenerateDeeplink={onLinkGenerated}>
            <DeeplinkContextProvider initialState={GET_MOCK_DEEPLINK_STATE()}>
                <ContextRenderer />
            </DeeplinkContextProvider>
        </ConsumerDeeplinkContext>
    );
};

export const Base = Template.bind({});
