import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import UserDefinedEntityForm from './UserDefinedEntityForm';
import { IUserDefinedEntityFormProps } from './UserDefinedEntityForm.types';
import { WizardDataManagementContextProvider } from '../../Contexts/WizardDataManagementContext/WizardDataManagementContext';
import {
    DEFAULT_MOCK_DATA_MANAGEMENT_STATE,
    DEFAULT_MOCK_GRAPH_PROVIDER_DATA,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../WizardShell/WizardShellMockData';
import {
    GraphContextProvider,
    useGraphContext
} from '../../Contexts/GraphContext/GraphContext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { PrimaryButton } from '@fluentui/react';
import { GraphContextActionType } from '../../Contexts/GraphContext/GraphContext.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Apps/Legion/Components/UserDefinedEntityForm',
    component: UserDefinedEntityForm,
    decorators: [
        getDefaultStoryDecorator<IUserDefinedEntityFormProps>(wrapperStyle)
    ]
};

type UserDefinedEntityFormStory = ComponentStory<typeof UserDefinedEntityForm>;

const Contents: UserDefinedEntityFormStory = (args) => {
    const { graphDispatch } = useGraphContext();
    return (
        <>
            <PrimaryButton
                text={'Open form'}
                onClick={() => {
                    graphDispatch({
                        type: GraphContextActionType.PARENT_FORM_MODAL_SHOW,
                        payload: {
                            nodeId: ''
                        }
                    });
                }}
            />
            <UserDefinedEntityForm {...args} />
        </>
    );
};

const Template: UserDefinedEntityFormStory = (args) => {
    return (
        <WizardDataManagementContextProvider
            initialState={{
                ...DEFAULT_MOCK_DATA_MANAGEMENT_STATE
            }}
        >
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <GraphContextProvider
                    {...DEFAULT_MOCK_GRAPH_PROVIDER_DATA}
                    initialState={{
                        ...DEFAULT_MOCK_GRAPH_PROVIDER_DATA.initialState,
                        isParentFormVisible: true
                    }}
                >
                    <Contents {...args} />
                </GraphContextProvider>
            </WizardNavigationContextProvider>
        </WizardDataManagementContextProvider>
    );
};

export const Base = Template.bind({}) as UserDefinedEntityFormStory;
Base.args = {} as IUserDefinedEntityFormProps;
