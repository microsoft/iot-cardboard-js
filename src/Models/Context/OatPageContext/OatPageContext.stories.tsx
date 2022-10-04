import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
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
import { OatPageContextProvider, useOatPageContext } from './OatPageContext';
import {
    OatPageContextActionType,
    IOatPageContextProviderProps,
    IOatPageContextState
} from './OatPageContext.types';
import { userEvent, within } from '@storybook/testing-library';
import { GET_MOCK_DEEPLINK_STATE } from './OatPageContext.mock';

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
    padding: 10
};
export default {
    title: 'Contexts/OatPageContext',
    component: OatPageContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};

const ProviderContentRenderer: React.FC = () => {
    const { oatPageState } = useOatPageContext();
    const theme = useTheme();
    const containerStyle = getContainerStyles(theme);
    const valueStyle = getValueStyle(theme);
    const stringify = (object: any) =>
        object ? JSON.stringify(object) : object;
    return (
        <Stack>
            <h3 style={headerStyles}>Context</h3>

            <Stack styles={containerStyle} tokens={{ childrenGap: 8 }}>
                <h4 style={headerStyles}>Current ontology</h4>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>OntologyId: </Label>
                    <Text styles={valueStyle}>{oatPageState.ontologyId}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Ontology name: </Label>
                    <Text styles={valueStyle}>{oatPageState.projectName}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Namespace: </Label>
                    <Text styles={valueStyle}>{oatPageState.namespace}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Models: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.models)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Positions: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.modelPositions)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Templates: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.templates)}
                    </Text>
                </Stack>
            </Stack>

            <Stack styles={containerStyle} tokens={{ childrenGap: 8 }}>
                <h4 style={headerStyles}>Other attributes</h4>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Selection: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.selection)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Selected model target: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.selectedModelTarget)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>is Modified: </Label>
                    <Text styles={valueStyle}>{oatPageState.modified}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Error: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.error)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Confirmation dialog: </Label>
                    <Text styles={valueStyle}>{oatPageState.ontologyId}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>JSON uploader: </Label>
                    <Text styles={valueStyle}>{oatPageState.ontologyId}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>IsTemplatesOpen: </Label>
                    <Text styles={valueStyle}>
                        {oatPageState.templatesActive}
                    </Text>
                </Stack>
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
    const { oatPageState, oatPageDispatch } = useOatPageContext();
    const [adtUrlIncrementor, setAdtUrlIncrementor] = useState<number>(0);
    const theme = useTheme();
    return (
        <Stack>
            <h4 style={headerStyles}>Context Updates</h4>
            <Stack
                styles={getContainerStyles(theme)}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <DefaultButton
                    data-testid={'OatPageContext-ChangeAdtUrl'}
                    iconProps={{ iconName: 'Add' }}
                    text="Increment ADT url"
                    onClick={() => {
                        const newValue = adtUrlIncrementor + 1;
                        oatPageDispatch({
                            type: OatPageContextActionType.SET_ADT_URL,
                            payload: {
                                url: oatPageState.adtUrl.replace(
                                    adtUrlIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setAdtUrlIncrementor(newValue);
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    defaultState: IOatPageContextState;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IOatPageContextProviderProps>
) => {
    return (
        <OatPageContextProvider initialState={args.defaultState}>
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </OatPageContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE()
} as StoryProps;

export const Empty = Template.bind({});
Empty.args = {} as StoryProps;

export const UpdateAdtUrl = Template.bind({});
UpdateAdtUrl.args = {
    defaultState: GET_MOCK_DEEPLINK_STATE()
} as StoryProps;
UpdateAdtUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'OatPageContext-ChangeAdtUrl'
    );
    await userEvent.click(behaviorsTabButton);
};
