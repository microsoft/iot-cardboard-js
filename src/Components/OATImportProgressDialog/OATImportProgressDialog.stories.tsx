import React from 'react';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import OATImportProgressDialog from './OATImportProgressDialog';
import { IOATImportProgressDialogProps } from './OATImportProgressDialog.types';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { IImportState } from '../../Models/Context/OatPageContext/OatPageContext.types';

const wrapperStyle = { width: '100%', height: '600px', padding: 8 };

export default {
    title: 'Components - OAT/OATImportProgressDialog',
    component: OATImportProgressDialog,
    decorators: [
        getDefaultStoryDecorator<IOATImportProgressDialogProps>(wrapperStyle)
    ]
};

type StoryArgs = {
    importState: IImportState;
};

const Template = (args: StoryArgs) => {
    return (
        <OatPageContextProvider
            disableLocalStorage={true}
            initialState={{
                importState: args.importState
            }}
        >
            <OATImportProgressDialog />
        </OatPageContextProvider>
    );
};

export const Loading = Template.bind({});
Loading.args = {
    importState: {
        state: 'loading',
        fileCount: 5
    }
} as StoryArgs;

export const Success = Template.bind({});
Success.args = {
    importState: {
        state: 'success',
        modelCount: 7
    }
} as StoryArgs;

export const Failed = Template.bind({});
Failed.args = {
    importState: {
        state: 'failed',
        title: 'something went wrong',
        message: 'error happened during import'
    }
} as StoryArgs;
