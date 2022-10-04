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
import { GET_MOCK_OAT_CONTEXT_STATE } from './OatPageContext.mock';

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
                    <Text styles={valueStyle}>
                        {oatPageState.currentOntologyId}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Ontology name: </Label>
                    <Text styles={valueStyle}>
                        {oatPageState.currentOntologyProjectName}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Namespace: </Label>
                    <Text styles={valueStyle}>
                        {oatPageState.currentOntologyNamespace}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Models: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.currentOntologyModels)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Positions: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.currentOntologyModelPositions)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Templates: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.currentOntologyTemplates)}
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
                    <Label>Error: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.error)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Confirmation dialog: </Label>
                    <Text styles={valueStyle}>
                        <div>Open: {oatPageState.confirmDeleteOpen.open}</div>
                        <div>Title: {oatPageState.confirmDeleteOpen.title}</div>
                        <div>
                            Message: {oatPageState.confirmDeleteOpen.message}
                        </div>
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>IsModified: </Label>
                    <Text styles={valueStyle}>{oatPageState.modified}</Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>IsJSONEditorOpen: </Label>
                    <Text styles={valueStyle}>
                        {oatPageState.isJsonUploaderOpen}
                    </Text>
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
    const [nameIncrementor, setNameIncrementor] = useState<number>(0);
    const [modelIncrementor, setModelIncrementor] = useState<number>(0);
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
                    data-testid={'OatPageContext-ChangeName'}
                    iconProps={{ iconName: 'Add' }}
                    text="Increment Name"
                    onClick={() => {
                        const newValue = nameIncrementor + 1;
                        oatPageDispatch({
                            type: OatPageContextActionType.SET_OAT_PROJECT_NAME,
                            payload: {
                                name: oatPageState.currentOntologyProjectName.replace(
                                    nameIncrementor.toString(),
                                    newValue.toString()
                                )
                            }
                        });
                        setNameIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'OatPageContext-AddModel'}
                    iconProps={{ iconName: 'Add' }}
                    text={'Add model'}
                    onClick={() => {
                        const newValue = modelIncrementor + 1;
                        const models = [...oatPageState.currentOntologyModels];
                        models.push({
                            '@context': 'testContext',
                            '@id': `modelId-${newValue}`,
                            '@type': 'testType',
                            displayName: `model-${newValue}`
                        });
                        oatPageDispatch({
                            type: OatPageContextActionType.SET_OAT_MODELS,
                            payload: {
                                models: models
                            }
                        });
                        setModelIncrementor(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'OatPageContext-AddModel'}
                    iconProps={{ iconName: 'Subtract' }}
                    text={'Remove model'}
                    onClick={() => {
                        const newValue =
                            modelIncrementor > 1 ? modelIncrementor - 1 : 0;
                        const models = [...oatPageState.currentOntologyModels];
                        models.pop();
                        oatPageDispatch({
                            type: OatPageContextActionType.SET_OAT_MODELS,
                            payload: {
                                models: models
                            }
                        });
                        setModelIncrementor(newValue);
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
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;

export const Empty = Template.bind({});
Empty.args = {} as StoryProps;

export const UpdateAdtUrl = Template.bind({});
UpdateAdtUrl.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdateAdtUrl.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'OatPageContext-ChangeAdtUrl'
    );
    await userEvent.click(behaviorsTabButton);
};
