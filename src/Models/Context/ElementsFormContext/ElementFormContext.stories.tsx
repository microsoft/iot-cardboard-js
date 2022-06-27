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
import { userEvent, within } from '@storybook/testing-library';

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
                    <Label>Layer ids: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(
                            elementFormState?.elementSelectedLayerIds
                        )}
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

    const [layerIncrementor, setLayerIdIncrementor] = useState(0);
    const originalName = useRef<string>(
        elementFormState.elementToEdit?.displayName
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
                                ElementFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET,
                            payload: {
                                name: newValue
                            }
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-AddLayer'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add layer"
                    onClick={() => {
                        const layerToAdd = 'layer-' + layerIncrementor;
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD,
                            payload: {
                                meshIds: layerToAdd
                            }
                        });
                        const newLayerNumber = layerIncrementor + 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-RemoveLayer'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove layer"
                    onClick={() => {
                        const layerToRemove = 'layer-' + (layerIncrementor - 1);
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE,
                            payload: {
                                meshIds: layerToRemove
                            }
                        });
                        const newLayerNumber = layerIncrementor - 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'ElementFormContext-Reset'}
                    iconProps={{ iconName: 'Refresh' }}
                    text="Reset"
                    onClick={() => {
                        elementFormDispatch({
                            type:
                                ElementFormContextActionType.FORM_BEHAVIOR_RESET
                        });
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
            elementSelectedLayerIds={args.initialState.elementSelectedLayerIds}
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

export const UpdateDisplayName = Template.bind({});
UpdateDisplayName.args = {
    initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
} as StoryProps;
UpdateDisplayName.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const elementsTabButton = await canvas.findByTestId(
        'ElementFormContext-ToggleName'
    );
    userEvent.click(elementsTabButton);
};

export const AddLayer = Template.bind({});
AddLayer.args = {
    initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
} as StoryProps;
AddLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const elementsTabButton = await canvas.findByTestId(
        'ElementFormContext-AddLayer'
    );
    userEvent.click(elementsTabButton);
};

export const RemoveLayer = Template.bind({});
RemoveLayer.args = {
    initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
} as StoryProps;
RemoveLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const elementsTabButton = await canvas.findByTestId(
        'ElementFormContext-RemoveLayer'
    );
    userEvent.click(elementsTabButton);
};

export const ResetAfterChanges = Template.bind({});
ResetAfterChanges.args = {
    initialState: GET_MOCK_ELEMENT_FORM_PROVIDER_PROPS()
} as StoryProps;
ResetAfterChanges.play = async ({ canvasElement }) => {
    await UpdateDisplayName.play({ canvasElement });
    await AddLayer.play({ canvasElement });

    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const elementsTabButton = await canvas.findByTestId(
        'ElementFormContext-Reset'
    );
    userEvent.click(elementsTabButton);
};

// export const UpdateStorageUrl = Template.bind({});
// UpdateStorageUrl.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// UpdateStorageUrl.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-ChangeStorageUrl'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const UpdateMode = Template.bind({});
// UpdateMode.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// UpdateMode.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-ChangeMode'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const UpdateSceneId = Template.bind({});
// UpdateSceneId.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// UpdateSceneId.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-SceneId'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const UpdateSelectedElement = Template.bind({});
// UpdateSelectedElement.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// UpdateSelectedElement.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-SelectedElementId'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const AddLayer = Template.bind({});
// AddLayer.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// AddLayer.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-AddLayer'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const RemoveLayer = Template.bind({});
// RemoveLayer.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// RemoveLayer.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-RemoveLayer'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const ExcludeElementId = Template.bind({});
// ExcludeElementId.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// ExcludeElementId.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-IncludeElementId'
//     );
//     await userEvent.click(elementsTabButton);
// };

// export const ExcludeLayerIds = Template.bind({});
// ExcludeLayerIds.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     ElementFormProps: defaultElementFormOptions
// } as StoryProps;
// ExcludeLayerIds.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const elementsTabButton = await canvas.findByTestId(
//         'ElementFormContext-IncludeLayerIds'
//     );
//     await userEvent.click(elementsTabButton);
// };
