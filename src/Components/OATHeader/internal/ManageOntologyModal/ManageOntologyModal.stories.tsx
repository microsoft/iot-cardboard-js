import React from 'react';
import { getDefaultStoryDecorator } from '../../../../Models/Services/StoryUtilities';
import ManageOntologyModal from './ManageOntologyModal';
import { IManageOntologyModalProps } from './ManageOntologyModal.types';
import { OatPageContextProvider } from '../../../../Models/Context/OatPageContext/OatPageContext';
import { OAT_DEFAULT_CONTEXT } from '../../../../Models/Constants';
import { DTDL_CONTEXT_VERSION_3 } from '../../../../Models/Classes/DTDL';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/ManageOntologyModal',
    component: ManageOntologyModal,
    decorators: [
        getDefaultStoryDecorator<IManageOntologyModalProps>(wrapperStyle)
    ]
};

type StoryProps = IManageOntologyModalProps & {
    defaultContext: string;
};
const Template = (args: StoryProps) => {
    return (
        <OatPageContextProvider
            initialState={{
                currentOntologyDefaultPath: 'testNamespace',
                currentOntologyProjectName: 'my test project',
                currentOntologyDefaultContext:
                    args.defaultContext ?? OAT_DEFAULT_CONTEXT
            }}
        >
            <ManageOntologyModal {...args} />
        </OatPageContextProvider>
    );
};

export const Create = Template.bind({});
Create.args = {
    isOpen: true,
    ontologyId: '',
    onClose: () => alert('closed')
} as StoryProps;

export const Edit = Template.bind({});
Edit.args = {
    isOpen: true,
    ontologyId: 'test -id',
    onClose: () => alert('closed')
} as StoryProps;

export const V3Model = Template.bind({});
V3Model.args = {
    isOpen: true,
    ontologyId: 'test -id',
    onClose: () => alert('closed'),
    defaultContext: DTDL_CONTEXT_VERSION_3
} as StoryProps;
