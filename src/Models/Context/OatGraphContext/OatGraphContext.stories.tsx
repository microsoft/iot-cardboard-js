import React from 'react';
import { ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    DefaultButton,
    IStyle,
    ITextStyles,
    ITheme,
    Label,
    Stack,
    Text,
    useTheme
} from '@fluentui/react';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';
import { OatGraphContextProvider, useOatGraphContext } from './OatGraphContext';
import {
    OatGraphContextActionType,
    IOatGraphContextProviderProps,
    IOatGraphContextState
} from './OatGraphContext.types';
import { GET_MOCK_OAT_GRAPH_CONTEXT_STATE } from './OatGraphContext.mock';

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
const getValueStyle = (theme: ITheme): ITextStyles => ({
    root: {
        color: theme.palette.neutralSecondary
    }
});
const getContainerStyles = (_theme: ITheme) => ({
    root: {
        padding: 8,
        border: `1px solid ${_theme.palette.neutralLight}`
    } as IStyle
});

const wrapperStyle: React.CSSProperties = {
    width: 'auto',
    padding: 8
};
export default {
    title: 'Contexts/OatGraphContext',
    component: OatGraphContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ProviderContentRenderer: React.FC = () => {
    const { oatGraphState } = useOatGraphContext();
    const theme = useTheme();
    const containerStyle = getContainerStyles(theme);
    const valueStyle = getValueStyle(theme);
    return (
        <Stack
            styles={{
                root: {
                    maxHeight: 600,
                    overflow: 'auto'
                }
            }}
        >
            <h3 style={headerStyles}>Context</h3>

            <Stack styles={containerStyle} tokens={{ childrenGap: 8 }}>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Loading: </Label>
                    <Text styles={valueStyle}>
                        {oatGraphState.isLoading ? 'true' : 'false'}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Show components: </Label>
                    <Text styles={valueStyle}>
                        {oatGraphState.showComponents ? 'true' : 'false'}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Show inheritance: </Label>
                    <Text styles={valueStyle}>
                        {oatGraphState.showInheritances ? 'true' : 'false'}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Show relationships: </Label>
                    <Text styles={valueStyle}>
                        {oatGraphState.showRelationships ? 'true' : 'false'}
                    </Text>
                </Stack>
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
    const { oatGraphDispatch } = useOatGraphContext();
    // const [nameIncrementor, setNameIncrementor] = useState<number>(0);
    const theme = useTheme();
    return (
        <Stack>
            <h3 style={headerStyles}>Context Updates</h3>
            <Stack
                styles={getContainerStyles(theme)}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <DefaultButton
                    data-testid={'OatGraphContext-ToggleLoading'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle loading"
                    onClick={() => {
                        oatGraphDispatch({
                            type: OatGraphContextActionType.LOADING_TOGGLE
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'OatGraphContext-ToggleComponents'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle components"
                    onClick={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_COMPONENTS_TOGGLE
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'OatGraphContext-ToggleInheritances'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle inheritance"
                    onClick={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_INHERITANCES_TOGGLE
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'OatGraphContext-ToggleRelationships'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle relationships"
                    onClick={() => {
                        oatGraphDispatch({
                            type:
                                OatGraphContextActionType.SHOW_RELATIONSHIPS_TOGGLE
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    defaultState: IOatGraphContextState;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IOatGraphContextProviderProps>
) => {
    return (
        <OatGraphContextProvider initialState={args.defaultState}>
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </OatGraphContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    defaultState: GET_MOCK_OAT_GRAPH_CONTEXT_STATE()
} as StoryProps;

export const ToggleComponents = Template.bind({});
ToggleComponents.args = {
    defaultState: GET_MOCK_OAT_GRAPH_CONTEXT_STATE()
} as StoryProps;
ToggleComponents.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId(
        'OatGraphContext-ToggleComponents'
    );
    userEvent.click(button);
};

export const ToggleInheritance = Template.bind({});
ToggleInheritance.args = {
    defaultState: GET_MOCK_OAT_GRAPH_CONTEXT_STATE()
} as StoryProps;
ToggleInheritance.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId(
        'OatGraphContext-ToggleInheritances'
    );
    userEvent.click(button);
};

export const ToggleRelationships = Template.bind({});
ToggleRelationships.args = {
    defaultState: GET_MOCK_OAT_GRAPH_CONTEXT_STATE()
} as StoryProps;
ToggleRelationships.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId(
        'OatGraphContext-ToggleRelationships'
    );
    userEvent.click(button);
};
