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
} from '../../../../../../Models/Services/StoryUtilities';
import {
    BehaviorFormContextProvider,
    useBehaviorFormContext
} from './BehaviorFormContext';
import {
    IBehaviorFormContextProviderProps,
    IBehaviorFormContextState
} from './BehaviorFormContext.types';
import { GET_MOCK_BEHAVIOR_FORM_STATE } from './BehaviorFormContext.mock';

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
            </Stack>
        </Stack>
    );
};

const ProviderUpdater: React.FC = () => {
    // const {
    //     behaviorFormState,
    //     behaviorFormDispatch
    // } = useBehaviorFormContext();
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
                    data-testid={'BehaviorFormContext-ChangeAdtUrl'}
                    iconProps={{ iconName: 'Add' }}
                    text="Increment ADT url"
                    onClick={() => {
                        const newValue = adtUrlIncrementor + 1;
                        // behaviorFormDispatch({
                        //     type: BehaviorFormContextActionType.SET_ADT_URL,
                        //     payload: {
                        //         url: behaviorFormState.adtUrl.replace(
                        //             adtUrlIncrementor.toString(),
                        //             newValue.toString()
                        //         )
                        //     }
                        // });
                        setAdtUrlIncrementor(newValue);
                    }}
                />
            </Stack>
        </Stack>
    );
};

type StoryProps = {
    defaultState: IBehaviorFormContextState;
};
type SceneBuilderStory = ComponentStory<any>;
const Template: SceneBuilderStory = (
    args: StoryProps,
    _context: IStoryContext<IBehaviorFormContextProviderProps>
) => {
    return (
        <BehaviorFormContextProvider initialState={args.defaultState}>
            <Stack>
                <ProviderContentRenderer />
                <ProviderUpdater />
            </Stack>
        </BehaviorFormContextProvider>
    );
};

export const Base = Template.bind({});
Base.args = {
    defaultState: GET_MOCK_BEHAVIOR_FORM_STATE()
} as StoryProps;

// export const Empty = Template.bind({});
// Empty.args = {
//     BehaviorFormProps: {
//         excludeBaseUrl: true
//     }
// } as StoryProps;

// export const UpdateAdtUrl = Template.bind({});
// UpdateAdtUrl.args = {
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateAdtUrl.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-ChangeAdtUrl'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const UpdateStorageUrl = Template.bind({});
// UpdateStorageUrl.args = {
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
//     BehaviorFormProps: defaultBehaviorFormOptions
// } as StoryProps;
// UpdateStorageUrl.play = async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     // Finds the button and clicks it
//     const behaviorsTabButton = await canvas.findByTestId(
//         'BehaviorFormContext-ChangeStorageUrl'
//     );
//     await userEvent.click(behaviorsTabButton);
// };

// export const UpdateMode = Template.bind({});
// UpdateMode.args = {
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
//     defaultState: GET_MOCK_BEHAVIOR_FORM_STATE(),
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
