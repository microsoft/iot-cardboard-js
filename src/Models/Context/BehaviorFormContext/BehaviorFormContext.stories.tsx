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
    BehaviorFormContextProvider,
    useBehaviorFormContext
} from './BehaviorFormContext';
import {
    BehaviorFormContextActionType,
    IBehaviorFormContextProviderProps
} from './BehaviorFormContext.types';
import { GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS } from './BehaviorFormContext.mock';
import { userEvent, within } from '@storybook/testing-library';
import {
    getDefaultStoryDecorator,
    IStoryContext
} from '../../Services/StoryUtilities';

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
    title: 'Contexts/BehaviorFormContext',
    component: BehaviorFormContextProvider,
    decorators: [getDefaultStoryDecorator(wrapperStyle)]
};
const ProviderContentRenderer: React.FC = () => {
    const { behaviorFormState } = useBehaviorFormContext();
    const theme = useTheme();
    const containerStyle = getContainerStyles(theme);
    const valueStyle = getValueStyle(theme);
    return (
        <Stack>
            <h4 style={headerStyles}>Context</h4>

            <Stack styles={containerStyle}>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Behavior to edit: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(behaviorFormState?.behaviorToEdit)}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>Layer ids: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(
                            behaviorFormState?.behaviorSelectedLayerIds
                        )}
                    </Text>
                </Stack>
                <Stack horizontal styles={itemStackStyles}>
                    <Label>IsDirty: </Label>
                    <Text styles={valueStyle}>
                        {JSON.stringify(behaviorFormState?.isDirty)}
                    </Text>
                </Stack>
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
    const {
        behaviorFormState,
        behaviorFormDispatch
    } = useBehaviorFormContext();
    const theme = useTheme();

    const [layerIncrementor, setLayerIdIncrementor] = useState(0);
    const originalName = useRef<string>(
        behaviorFormState.behaviorToEdit?.displayName
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
                    data-testid={'BehaviorFormContext-ToggleName'}
                    iconProps={{ iconName: 'Switch' }}
                    text="Toggle behavior name"
                    onClick={() => {
                        const alernateName = 'my other name';
                        const newValue =
                            behaviorFormState.behaviorToEdit.displayName ===
                            alernateName
                                ? originalName.current
                                : alernateName;
                        behaviorFormDispatch({
                            type:
                                BehaviorFormContextActionType.FORM_BEHAVIOR_DISPLAY_NAME_SET,
                            payload: {
                                name: newValue
                            }
                        });
                    }}
                />
                <DefaultButton
                    data-testid={'BehaviorFormContext-AddLayer'}
                    iconProps={{ iconName: 'Add' }}
                    text="Add layer"
                    onClick={() => {
                        const layerToAdd = 'layer-' + layerIncrementor;
                        behaviorFormDispatch({
                            type:
                                BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_ADD,
                            payload: {
                                layerId: layerToAdd
                            }
                        });
                        const newLayerNumber = layerIncrementor + 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'BehaviorFormContext-RemoveLayer'}
                    iconProps={{ iconName: 'Delete' }}
                    text="Remove layer"
                    onClick={() => {
                        const layerToRemove = 'layer-' + (layerIncrementor - 1);
                        behaviorFormDispatch({
                            type:
                                BehaviorFormContextActionType.FORM_BEHAVIOR_LAYERS_REMOVE,
                            payload: {
                                layerId: layerToRemove
                            }
                        });
                        const newLayerNumber = layerIncrementor - 1;
                        setLayerIdIncrementor(newLayerNumber);
                    }}
                />
                <DefaultButton
                    data-testid={'BehaviorFormContext-Reset'}
                    iconProps={{ iconName: 'Refresh' }}
                    text="Reset"
                    onClick={() => {
                        behaviorFormDispatch({
                            type:
                                BehaviorFormContextActionType.FORM_BEHAVIOR_RESET
                        });
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    initialState: IBehaviorFormContextProviderProps;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IBehaviorFormContextProviderProps>
) => {
    return (
        <BehaviorFormContextProvider
            behaviorToEdit={args.initialState?.behaviorToEdit}
            behaviorSelectedLayerIds={
                args.initialState.behaviorSelectedLayerIds
            }
        >
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </BehaviorFormContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    initialState: GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS()
} as StoryProps;

export const UpdateDisplayName = Template.bind({});
UpdateDisplayName.args = {
    initialState: GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS()
} as StoryProps;
UpdateDisplayName.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'BehaviorFormContext-ToggleName'
    );
    userEvent.click(behaviorsTabButton);
};

export const AddLayer = Template.bind({});
AddLayer.args = {
    initialState: GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS()
} as StoryProps;
AddLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'BehaviorFormContext-AddLayer'
    );
    userEvent.click(behaviorsTabButton);
};

export const RemoveLayer = Template.bind({});
RemoveLayer.args = {
    initialState: GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS()
} as StoryProps;
RemoveLayer.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'BehaviorFormContext-RemoveLayer'
    );
    userEvent.click(behaviorsTabButton);
};

export const ResetAfterChanges = Template.bind({});
ResetAfterChanges.args = {
    initialState: GET_MOCK_BEHAVIOR_FORM_PROVIDER_PROPS()
} as StoryProps;
ResetAfterChanges.play = async ({ canvasElement }) => {
    await UpdateDisplayName.play({ canvasElement });
    await AddLayer.play({ canvasElement });

    const canvas = within(canvasElement);
    // Finds the button and clicks it
    const behaviorsTabButton = await canvas.findByTestId(
        'BehaviorFormContext-Reset'
    );
    userEvent.click(behaviorsTabButton);
};

// export const UpdateStorageContainerUrl = Template.bind({});
// UpdateStorageContainerUrl.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateStorageContainerUrl.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-ChangeStorageContainerUrl'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const UpdateMode = Template.bind({});
// UpdateMode.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateMode.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-ChangeMode'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const UpdateSceneId = Template.bind({});
// UpdateSceneId.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateSceneId.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-SceneId'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const UpdateSelectedElement = Template.bind({});
// UpdateSelectedElement.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateSelectedElement.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-SelectedElementId'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const AddLayer = Template.bind({});
// AddLayer.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// AddLayer.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-AddLayer'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const RemoveLayer = Template.bind({});
// RemoveLayer.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// RemoveLayer.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-RemoveLayer'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const ExcludeElementId = Template.bind({});
// ExcludeElementId.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// ExcludeElementId.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-IncludeElementId'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const ExcludeLayerIds = Template.bind({});
// ExcludeLayerIds.args = {
//     initialState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// ExcludeLayerIds.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-IncludeLayerIds'
//     );
//     await userEvent.click(behaviorsTabButton);
// };
