import React from 'react';
import { OatPageContextProvider } from '../../Models/Context/OatPageContext/OatPageContext';
import { getMockFile } from '../../Models/Context/OatPageContext/OatPageContext.mock';
import { getDefaultStoryDecorator } from '../../Models/Services/StoryUtilities';
import { CommandHistoryContextProvider } from '../../Pages/OATEditorPage/Internal/Context/CommandHistoryContext';
import BaseComponent from '../BaseComponent/BaseComponent';
import OATGraphViewer from './OATGraphViewer';
import { IOATGraphViewerProps } from './OATGraphViewer.types';

const wrapperStyle = { width: '100%', height: '700px', padding: 8 };
export default {
    title: 'Components - OAT/OATGraphViewer',
    component: OATGraphViewer,
    decorators: [getDefaultStoryDecorator<IOATGraphViewerProps>(wrapperStyle)]
};

export const Default = (_args, { globals: { theme, locale } }) => {
    return (
        <BaseComponent locale={locale} theme={theme}>
            <OatPageContextProvider
                disableLocalStorage={true}
                initialState={{
                    ontologyFiles: [getMockFile(0, '123', '234')]
                }}
            >
                <CommandHistoryContextProvider>
                    <OATGraphViewer />
                </CommandHistoryContextProvider>
            </OatPageContextProvider>
        </BaseComponent>
    );
};
