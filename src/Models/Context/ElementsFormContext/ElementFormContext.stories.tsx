import React, { useRef, useState } from 'react';
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
import {
    ElementFormContextProvider,
    useElementFormContext
} from './ElementFormContext';
import {
    ElementFormContextActionType,
    IElementFormContextProviderProps
} from './ElementFormContext.types';
import { GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS } from './ElementFormContext.mock';

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
    title: 'Contexts/ElementFormContext',
    component: ElementFormContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};
const ProviderContentRenderer: React.FC = () => {
    const { elementFormState } = useElementFormContext();
    const theme = useTheme();
    const containerStyle = getContainerStyles(theme);
    const valueStyle = getValueStyle(theme);
    return (
        <Stack>
            <h4 style={headerStyles}>Context</h4>

            <Stack styles={containerStyle}>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Element to edit: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(elementFormState?.elementToEdit)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Behavior ids: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(elementFormState?.linkedBehaviorIds)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>IsDirty: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(elementFormState?.isDirty)}
                    </Text>
                </Stack>
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
    const { elementFormState, elementFormDispatch } = useElementFormContext();
    const theme = useTheme();

    const [aliasIncrementor, setLayerIdIncrementor] = useState(0);
    const [behaviorIncrementor, setBehaviorIncrementor] = useState(0);
    const [meshIncrementor, setMeshIncrementor] = useState(0);
    const [meshes, setMeshes] = useState([]);
    const originalName = useRef<string>(
        elementFormState.elementToEdit?.displayName
    );
    const originalTwin = useRef<string>(
        elementFormState.elementToEdit?.primaryTwinID
    );
    return (
        <Stack>
            <h4 style={headerStyles}>Context Updates</h4>
            <Stack
                styles={getContainerStyles(theme)}
                horizontal
                tokens={{ childrenGap: 8 }}
            >
                <DefaultButton
                    data-testid={'ElementFormContext-ToggleName'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle element name"
                    onClick={() => {
                        const alernateName = 'my other name';
                        const newValue =
                            elementFormState.elementToEdit.displayName ===
                            alernateName
                                ? originalName.current
                                : alernateName;
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_DISPLAY_NAME_SET,
                            payload: {
                                name: newValue
                            }
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-ToggleTwinId'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle twin id"
                    onClick={() => {
                        const alernateTwin = 'twin 2';
                        const newValue =
                            elementFormState.elementToEdit.primaryTwinID ===
                            alernateTwin
                                ? originalTwin.current
                                : alernateTwin;
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_TWIN_ID_SET,
                            payload: {
                                twinId: newValue
                            }
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-AddMesh'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add mesh"
                    onClick={() => {
                        const newValue = [...meshes, 'mesh-' + meshIncrementor];
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS,
                            payload: {
                                meshIds: newValue
                            }
                        });
                        setMeshIncrementor((previous) => previous + 1);
                        setMeshes(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-RemoveMesh'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove mesh"
                    onClick={() => {
                        const newValue = [...meshes];
                        newValue.pop();
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_SET_MESH_IDS,
                            payload: {
                                meshIds: newValue
                            }
                        });
                        setMeshIncrementor((previous) => {
                            if (previous > 0) return previous - 1;
                            else return 0;
                        });
                        setMeshes(newValue);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-AddBehavior'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add behavior"
                    onClick={() => {
                        const toAdd = 'behavior-' + behaviorIncrementor;
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_ADD,
                            payload: {
                                id: toAdd
                            }
                        });
                        const newLayerNumber = behaviorIncrementor + 1;
                        setBehaviorIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-RemoveBehavior'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove alias"
                    onClick={() => {
                        const toRemove =
                            'behavior-' + (behaviorIncrementor - 1);
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_BEHAVIOR_LINK_REMOVE,
                            payload: {
                                id: toRemove
                            }
                        });
                        const newLayerNumber = behaviorIncrementor - 1;
                        setBehaviorIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-AddLayer'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add alias"
                    onClick={() => {
                        const aliasToAdd = 'alias-' + aliasIncrementor;
                        const targetToAdd = 'target-' + aliasIncrementor;
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_ADD,
                            payload: {
                                aliasName: aliasToAdd,
                                aliasTarget: targetToAdd
                            }
                        });
                        const newLayerNumber = aliasIncrementor + 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-RemoveLayer'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove alias"
                    onClick={() => {
                        const aliasToRemove = 'alias-' + (aliasIncrementor - 1);
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_ELEMENT_TWIN_ALIAS_REMOVE,
                            payload: {
                                aliasName: aliasToRemove
                            }
                        });
                        const newLayerNumber = aliasIncrementor - 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    initialState: IElementFormContextProviderProps;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IElementFormContextProviderProps>
) => {
    return (
        <ElementFormContextProvider
            elementToEdit={args.initialState?.elementToEdit}
            linkedBehaviorIds={args.initialState.linkedBehaviorIds}
        >
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </ElementFormContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
} as StoryProps;

// export const UpdateDisplayName = Template.bind({});
// UpdateDisplayName.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// UpdateDisplayName.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-ToggleName'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const AddMeshId = Template.bind({});
// AddMeshId.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// AddMeshId.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-AddMesh'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const RemoveMeshId = Template.bind({});
// RemoveMeshId.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// RemoveMeshId.play = async ({ canvasElement }) => {
//     await AddMeshId.play({ canvasElement });
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-RemoveMesh'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const AddBehavior = Template.bind({});
// AddBehavior.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// AddBehavior.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-AddBehavior'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const RemoveBehavior = Template.bind({});
// RemoveBehavior.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// RemoveBehavior.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-RemoveBehavior'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const AddAlias = Template.bind({});
// AddAlias.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// AddAlias.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-AddLayer'
//     );
//     userEvent.click(elementsTabButton);
// };

// export const RemoveAlias = Template.bind({});
// RemoveAlias.args = {
//     initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
// } as StoryProps;
// RemoveAlias.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-RemoveLayer'
//     );
//     userEvent.click(elementsTabButton);
// };
