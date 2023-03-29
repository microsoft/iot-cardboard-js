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
import { OatPageContextProvider, useOatPageContext } from './GraphContext';
import {
    OatPageContextActionType,
    IOatPageContextProviderProps,
    IOatPageContextState
} from './OatPageContext.types';
import { userEvent, within } from '@storybook/testing-library';
import { GET_MOCK_OAT_CONTEXT_STATE } from './GraphContext.mock';
import { OAT_DEFAULT_CONTEXT } from '../../Constants/Constants';

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
        <Stack
            styles={{
                root: {
                    maxHeight: 600,
                    overflow: 'auto'
                }
            }}
        >
            <h3 style={headerStyles}>Context</h3>

            {/* Current ontology */}
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
                        {oatPageState.currentOntologyDefaultPath}
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
                    <Label>Metadata: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.currentOntologyModelMetadata)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Templates: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.currentOntologyTemplates)}
                    </Text>
                </Stack>
            </Stack>

            {/* Other attributes */}
            <Stack styles={containerStyle} tokens={{ childrenGap: 8 }}>
                <h4 style={headerStyles}>Other attributes</h4>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Files: </Label>
                    <Text styles={valueStyle}>
                        {oatPageState.ontologyFiles
                            .map((x) => x.data.projectName)
                            .join(', ')}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Selection: </Label>
                    <Text styles={valueStyle}>
                        {stringify(oatPageState.selection)}
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
    const [positionIncrementor, setPositionIncrementor] = useState<number>(0);
    const [metadataIncrementor, setMetadataIncrementor] = useState<number>(0);
    const [templateIncrementor, setTemplateIncrementor] = useState<number>(0);
    const [selectionIncrementor, setSelectionIncrementor] = useState<number>(0);
    const [createIncrementor, setCreateIncrementor] = useState<number>(0);
    const [editIncrementor, setEditIncrementor] = useState<number>(0);
    const theme = useTheme();
    return (
        <Stack>
            <h3 style={headerStyles}>Context Updates</h3>
            <Stack
                styles={getContainerStyles(theme)}
                tokens={{ childrenGap: 8 }}
            >
                <h4 style={headerStyles}>Ontology Updates</h4>
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
                                type:
                                    OatPageContextActionType.SET_CURRENT_PROJECT_NAME,
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
                            const models = [
                                ...oatPageState.currentOntologyModels
                            ];
                            models.push({
                                '@context': 'testContext',
                                '@id': `modelId-${newValue}`,
                                '@type': 'testType',
                                displayName: `model-${newValue}`
                            });
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_CURRENT_MODELS,
                                payload: {
                                    models: models
                                }
                            });
                            setModelIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-RemoveModel'}
                        iconProps={{ iconName: 'Remove' }}
                        text={'Remove model'}
                        onClick={() => {
                            const newValue =
                                modelIncrementor > 1 ? modelIncrementor - 1 : 0;
                            const models = [
                                ...oatPageState.currentOntologyModels
                            ];
                            models.pop();
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_CURRENT_MODELS,
                                payload: {
                                    models: models
                                }
                            });
                            setModelIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-UpdatePosition'}
                        iconProps={{ iconName: 'Add' }}
                        text={'Update position'}
                        onClick={() => {
                            const newValue = positionIncrementor + 1;
                            const data = [
                                ...oatPageState.currentOntologyModelPositions
                            ];
                            data[0].position = {
                                x: newValue,
                                y: newValue + 2
                            };
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_CURRENT_MODELS_POSITIONS,
                                payload: {
                                    positions: data
                                }
                            });
                            setPositionIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-UpdateMetadata'}
                        iconProps={{ iconName: 'Add' }}
                        text={'Update metadata'}
                        onClick={() => {
                            const newValue = metadataIncrementor + 1;
                            const data = [
                                ...oatPageState.currentOntologyModelMetadata
                            ];
                            data[0].fileName = data[0].fileName.replace(
                                metadataIncrementor.toString(),
                                newValue.toString()
                            );
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_CURRENT_MODELS_METADATA,
                                payload: {
                                    metadata: data
                                }
                            });
                            setMetadataIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-UpdateTemplates'}
                        iconProps={{ iconName: 'Add' }}
                        text={'Update templates'}
                        onClick={() => {
                            const newValue = templateIncrementor + 1;
                            const data = [
                                ...oatPageState.currentOntologyTemplates
                            ];
                            data[0].name = data[0].name.replace(
                                templateIncrementor.toString(),
                                newValue.toString()
                            );
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_CURRENT_TEMPLATES,
                                payload: {
                                    templates: data
                                }
                            });
                            setTemplateIncrementor(newValue);
                        }}
                    />
                </Stack>
                <h4 style={headerStyles}>Project actions</h4>
                <Stack
                    styles={getContainerStyles(theme)}
                    horizontal
                    tokens={{ childrenGap: 8 }}
                >
                    <DefaultButton
                        data-testid={'OatPageContext-CreateProject'}
                        iconProps={{ iconName: 'Add' }}
                        text={'New project'}
                        onClick={() => {
                            const newValue = createIncrementor + 1;
                            oatPageDispatch({
                                type: OatPageContextActionType.CREATE_PROJECT,
                                payload: {
                                    name: `Test-Project-${newValue}`,
                                    defaultPath: `TestNamespace${newValue}`,
                                    defaultContext: OAT_DEFAULT_CONTEXT
                                }
                            });
                            setCreateIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-EditProject'}
                        iconProps={{ iconName: 'Edit' }}
                        text={'Edit selected'}
                        onClick={() => {
                            const newValue = editIncrementor + 1;
                            oatPageDispatch({
                                type: OatPageContextActionType.EDIT_PROJECT,
                                payload: {
                                    name: `Test-Project-${newValue}`,
                                    defaultPath: `TestNamespace${newValue}`,
                                    defaultContext: OAT_DEFAULT_CONTEXT
                                }
                            });
                            setEditIncrementor(newValue);
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-DuplicateProject'}
                        iconProps={{ iconName: 'Copy' }}
                        text={'Duplicate current'}
                        onClick={() => {
                            oatPageDispatch({
                                type: OatPageContextActionType.DUPLICATE_PROJECT
                            });
                        }}
                    />
                    <DefaultButton
                        data-testid={'OatPageContext-DeleteProject'}
                        iconProps={{ iconName: 'Delete' }}
                        text={'Delete project'}
                        disabled={!oatPageState.ontologyFiles.length}
                        onClick={() => {
                            oatPageDispatch({
                                type: OatPageContextActionType.DELETE_PROJECT,
                                payload: {
                                    id: oatPageState.currentOntologyId
                                }
                            });
                        }}
                    />
                </Stack>
                <h4 style={headerStyles}>Other actions</h4>
                <Stack
                    styles={getContainerStyles(theme)}
                    horizontal
                    tokens={{ childrenGap: 8 }}
                >
                    <DefaultButton
                        data-testid={'OatPageContext-ChangeSelection'}
                        iconProps={{ iconName: 'Switch' }}
                        text={'Change selection'}
                        onClick={() => {
                            const newValue =
                                (selectionIncrementor + 1) %
                                oatPageState.currentOntologyModels.length;
                            oatPageDispatch({
                                type:
                                    OatPageContextActionType.SET_OAT_SELECTED_MODEL,
                                payload: {
                                    selection: {
                                        modelId:
                                            oatPageState.currentOntologyModels[
                                                newValue
                                            ]['@id']
                                    }
                                }
                            });
                            setSelectionIncrementor(newValue);
                        }}
                    />
                </Stack>
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
        <OatPageContextProvider
            initialState={args.defaultState}
            disableLocalStorage={true}
        >
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

export const UpdateName = Template.bind({});
UpdateName.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdateName.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-ChangeName');
    await userEvent.click(button);
};

export const AddModel = Template.bind({});
AddModel.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
AddModel.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-AddModel');
    await userEvent.click(button);
};

export const RemoveModel = Template.bind({});
RemoveModel.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
RemoveModel.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-RemoveModel');
    userEvent.click(button);
};

export const UpdatePosition = Template.bind({});
UpdatePosition.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdatePosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-UpdatePosition');
    userEvent.click(button);
};

export const UpdateMetadata = Template.bind({});
UpdateMetadata.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdateMetadata.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-UpdateMetadata');
    userEvent.click(button);
};

export const UpdateTemplates = Template.bind({});
UpdateTemplates.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdateTemplates.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-UpdateTemplates');
    userEvent.click(button);
};

export const CreateProject = Template.bind({});
CreateProject.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
CreateProject.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-CreateProject');
    userEvent.click(button);
};

export const EditProject = Template.bind({});
EditProject.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
EditProject.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-EditProject');
    userEvent.click(button);
};

export const DuplicateProject = Template.bind({});
DuplicateProject.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
DuplicateProject.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-DuplicateProject');
    userEvent.click(button);
};

export const DeleteProject = Template.bind({});
DeleteProject.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
DeleteProject.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-DeleteProject');
    userEvent.click(button);
};

export const UpdateSelection = Template.bind({});
UpdateSelection.args = {
    defaultState: GET_MOCK_OAT_CONTEXT_STATE()
} as StoryProps;
UpdateSelection.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const button = await canvas.findByTestId('OatPageContext-ChangeSelection');
    userEvent.click(button);
};
