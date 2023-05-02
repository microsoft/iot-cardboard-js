import React from 'react';
import { ComponentStory } from '@storybook/react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import UserDefinedEntityForm from './UserDefinedEntityForm';
import { IUserDefinedEntityFormProps } from './UserDefinedEntityForm.types';
import {
    DEFAULT_MOCK_GRAPH_PROVIDER_DATA,
    GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT,
    WIZARD_NAVIGATION_MOCK_DATA
} from '../WizardShell/WizardShellMockData';
import {
    GraphContextProvider,
    useGraphContext
} from '../../Contexts/GraphContext/GraphContext';
import { WizardNavigationContextProvider } from '../../Contexts/WizardNavigationContext/WizardNavigationContext';
import { PrimaryButton } from '@fluentui/react';
import { GraphContextActionType } from '../../Contexts/GraphContext/GraphContext.types';
import { WizardDataContextProvider } from '../../Contexts/WizardDataContext/WizardDataContext';

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
    const dataContext = GET_DEFAULT_MOCK_WIZARD_DATA_CONTEXT();
    return (
        <WizardDataContextProvider initialState={dataContext}>
            <WizardNavigationContextProvider
                initialState={WIZARD_NAVIGATION_MOCK_DATA}
            >
                <GraphContextProvider
                    {...DEFAULT_MOCK_GRAPH_PROVIDER_DATA}
                    initialState={{
                        ...DEFAULT_MOCK_GRAPH_PROVIDER_DATA.initialState,
                        isParentFormVisible: true,
                        selectedNodeIds: [
                            dataContext.entities[0].id,
                            dataContext.entities[1].id
                        ]
                    }}
                >
                    <Contents {...args} />
                </GraphContextProvider>
            </WizardNavigationContextProvider>
        </WizardDataContextProvider>
    );
};

export const Base = Template.bind({}) as UserDefinedEntityFormStory;
Base.args = {} as IUserDefinedEntityFormProps;
